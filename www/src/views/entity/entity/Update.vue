<template>
  <div class="main">
    <el-tabs v-model="activeTab" >
      <el-tab-pane label="基本设置" name="basic">
        <el-form :inline="true" :model="model.basic"  label-position="right" >
        <el-row type="flex" justify="start" class="multi-line">
          <j-edit-item
            label="名称" prop="name">
            <el-input v-model="model.basic.name" placeholder="请输入名称"></el-input>
            <p class="tip">会做为key</p>
          </j-edit-item>

          <j-edit-item
            label="说明" prop="des">
            <el-input v-model="model.basic.des" placeholder="请输入说明"></el-input>
          </j-edit-item>

          <j-edit-item
            label="所属分类" prop="type">
            <el-select v-model="model.basic.entityTypeId" placeholder="请选择分类">
              <el-option
                v-for="item in entityTypeList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </j-edit-item>

          <!-- 有能公共访问的路由 -->
          <j-edit-item
            label="支持公开访问" prop="isPublic">
            <el-switch
              v-model="model.basic.isPublic"
              on-text="是"
              off-text="否">
            </el-switch>
          </j-edit-item>

          <j-edit-item
            label="有列表页" prop="name">
            <el-switch
              v-model="model.basic.hasListPage"
              on-text="是"
              off-text="否">
            </el-switch>
          </j-edit-item>



          <j-edit-item
            label="有更新页" prop="name">
            <el-switch
              v-model="model.basic.hasUpdatePage"
              on-text="是"
              off-text="否">
            </el-switch>
          </j-edit-item>

          <j-edit-item
            label="在菜单中显示" prop="name">
            <el-switch
              v-if="model.basic.hasListPage"
              v-model="model.basic.isShowInMenu"
              on-text="是"
              off-text="否">
            </el-switch>
          </j-edit-item>
        </el-row>
      </el-form>
      </el-tab-pane>
      <el-tab-pane label="字段设置" name="cols">
        <div class="ly ly-r mb-10">
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
            label="说明(中文)"
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

              <div v-if="scope.row.dataType === 'string'">
                <el-input v-model="scope.row.maxLength" placeholder="长度"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="label"
            label="必填"
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
      </el-tab-pane>

      <el-tab-pane label="关联设置" name="relations">
        设计&开发中...
      </el-tab-pane>
    
    </el-tabs>
    <div class="ly ly-c mt-10">
      <el-button type="defalut" @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    

    <el-dialog title="验证规则" :visible.sync="isShowRuleDialog">
      <div class="ly ly-r mb-10">
        <el-button type="primary" @click="currRow.validRules.push({
          name: 'required',
          errMsg: generatorErrmsg(currRow)
        })">添加规则</el-button>
      </div>
      <el-table
        :data="currRow.validRules"
        border
        stripe>
        <el-table-column
          type="index"
          label="序列"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="model"
          label="规则名称"
          >
          <template slot-scope="scope">
            <el-select v-model="scope.row.name" placeholder="请选择">
              <el-option
                v-for="item in validRuleType"
                :key="item.key"
                :label="item.label"
                :value="item.key">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="errMsg"
          label="错误信息"
          >
          <template slot-scope="scope">
            <el-input v-model="scope.row.errMsg" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="op"
          label="操作"
          >
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="currRow.validRules.splice(scope.index, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowRuleDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./update.js">

</script>

<style scoped></style>