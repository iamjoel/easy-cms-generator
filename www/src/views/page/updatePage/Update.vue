<template>
  <div class="main">
    <el-tabs v-model="activeTab" >
      <el-tab-pane label="基本信息" name="basic">
        <el-form :inline="true" :model="model.basic"  label-position="right" >
        <el-row type="flex" justify="start" class="multi-line">
          <j-edit-item
            label="实体" prop="name">
            {{model.basic.entity.name}}
          </j-edit-item>
          <j-edit-item
            label="代码展开目录" prop="name">
            @/views/{{model.basic.codePath}}
          </j-edit-item>
          <j-edit-item
            label="包含文件">
            Update.vue, update.js, model.js
          </j-edit-item>
        </el-row>
      </el-form>
      </el-tab-pane>
      <el-tab-pane label="详情字段" name="cols">
        <div class="ly ly-r mb-10">
          <el-button type="info" @click="showChooseColDialog">从实体中选择</el-button>
          <el-button type="primary" @click="model.cols.push(deepClone(colItemTemplate))">添加字段</el-button>
        </div>
        <el-table
          :data="model.cols"
          border
          stripe>
          <el-table-column
            type="index"
            label="序列"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="key"
            label="名称"
            >
            <template  slot-scope="scope">
              <el-input v-model="scope.row.key" placeholder=""></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="label"
            label="中文名"
            >
            <template  slot-scope="scope">
              <el-input v-model="scope.row.label" placeholder=""></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="label"
            label="数据类型"
            >
            <template  slot-scope="scope">
              <el-select v-model="scope.row.dataType" placeholder="请选择">
                <el-option
                  v-for="item in colsDataType"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
              <el-button v-if="scope.row.dataType == 'select'" @click="showDialog(scope.row, 'DataSource')">
                数据来源
              </el-button>
              <el-button v-if="scope.row.dataType == 'img' || scope.row.dataType == 'imgs'" @click="showDialog(scope.row, 'Img')">
                配置
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="label"
            label="是否必填"
            >
            <template  slot-scope="scope">
              <el-switch
                v-model="scope.row.required"
                on-text="是"
                off-text="否">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="key"
            label="获取后格式化函数"
            >
            <template slot-scope="scope">
              <el-select v-model="scope.row.formatFn" placeholder="无" filterable clearable>
              <el-option
                v-for="item in model.fn"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="key"
            label="保存前格式化函数"
            >
            <template slot-scope="scope">
              <el-select v-model="scope.row.saveFormatFn" placeholder="无" filterable clearable>
              <el-option
                v-for="item in model.fn"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="key"
            label="操作"
            width="200"
            >
            <template slot-scope="scope">
              <el-button v-if="scope.$index > 0" size="small" type="info" @click="move('cols', scope.$index, 'up')">上移</el-button>
              <el-button v-if="scope.$index < model.cols.length - 1" size="small" type="info" @click="move('cols', scope.$index, 'down')">下移</el-button>
              <el-button size="small" type="danger" @click="model.cols.splice(scope.$index, 1)">删除</el-button>

            </template>
          </el-table-column>
        </el-table>

        <el-dialog 
          title="选择字段"
          :visible.sync="isShowChooseColDialog"
        >
          <el-table
            :data="canChooseCols"
            @selection-change="handleSelectedColsChange"
            border
            stripe>
            <!-- 改成checkbox -->
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="label"
              label="名称"
              >
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isShowChooseColDialog = false">取 消</el-button>
            <el-button type="primary" @click="chooseCols">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
    
      <el-tab-pane label="函数" name="fn">
        <div class="ly ly-r mb-10">
          <el-button type="primary" @click="model.fn.push({
              name: '',
              args: [],
              body: ''
          })">添加函数</el-button>
        </div>
        <el-table
          :data="model.fn"
          border
          stripe>
          <el-table-column
            type="index"
            label="序列"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="name"
            label="函数名"
            width="200"
            >
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder=""></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="key"
            label="参数"
            width="200"
            >
            <template slot-scope="scope">
              {{scope.row.args && scope.row.args.length > 0 ?  scope.row.args.map(arg=> arg && arg.name).join() : '无'}}
              <el-button @click="editArgs(scope.row)" size="small">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="key"
            label="函数体"
            >
            <template slot-scope="scope">
              <el-input v-model="scope.row.body"
              type="textarea"
              :rows="2" placeholder="请输入内容" ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="op"
            label="操作"
            >
            <template slot-scope="scope">
              <el-button size="small" type="danger" v-if="scope.row.name.indexOf('sys') === -1" @click="model.fn.splice(scope.$index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="ly ly-c mt-10">
      <el-button type="default" @click="$router.push('/page/list/update')">返回</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <el-dialog title="详情" :visible.sync="isShowEditArgsDialog">
      <div class="ly ly-r mb-10">
        <el-button type="primary" @click="currFn.args.push({
          name: ''
        })">添加参数</el-button>
      </div>
      <el-table
        :data="currFn.args"
        border
        stripe>
        <el-table-column
          type="index"
          label="序列"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="参数名"
          >
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          lable="操作"
          >
          <template slot-scope="scope">
            <el-button v-if="scope.$index > 0" size="small" type="info" @click="move('args', scope.$index, 'up')">上移</el-button>
            <el-button v-if="scope.$index < currFn.args.length - 1" size="small" type="info" @click="move('args', scope.$index, 'down')">下移</el-button>
            <el-button size="small" type="danger" @click="currFn.args.splice(scope.$index, 1)">删除</el-button>

          </template>
        </el-table-column>

      </el-table>
      <span slot="footer" class="dialog-footer">
        
        <el-button @click="isShowEditArgsDialog=false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="数据来源" :visible.sync="isShowDataSourceDialog">
      <el-form ref="form" :model="currRow" label-width="80px">
        <el-form-item label="数据来源类型">
          <el-select v-model="currRow.dataSource.type" placeholder="无" filterable clearable>
            <el-option
              v-for="item in dataSourceType"
              :key="item.key"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源">
          <el-select v-model="currRow.dataSource.key" placeholder="无" filterable clearable>
            <el-option
              v-for="item in getDataResource(currRow.dataSource.type)"
              :key="item.key || item.basic.name"
              :label="item.label || item.basic.des"
              :value="item.key || item.basic.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowDataSourceDialog = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="图片配置" :visible.sync="isShowImgDialog">
      <el-form :model="currRow" label-width="80px">
        <el-form-item label="图片数量" v-if="currRow.dataType === 'imgs'">
          <el-input v-model.number="currRow.imgConfig.max" type="number"></el-input>
        </el-form-item>
        <el-form-item label="提示">
          <el-input v-model="currRow.imgConfig.tip"></el-input>
        </el-form-item>
        <el-form-item label="宽高">
          <el-input v-model="currRow.imgConfig.size"></el-input>
          <div class="form-tip">在后台管理界面的宽高。值是一样的。</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowImgDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./update.js">

</script>

<style scoped></style>