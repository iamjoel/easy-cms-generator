<template>
  <div class="main menu-list-page">
    <!-- 
      从实体的配置中同步
    <div class="ly ly-r mb-10">
      <el-button type="primary" @click="add">新增</el-button>
    </div> -->
    <el-table
      :data="list"
      border
      stripe
      default-expand-all
    >
      <el-table-column
        prop="isPage"
        label="类型"
        width="90"
        >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isPage"
            :on-value="1"
            :off-value="0"
            on-text="页面"
            off-text="分类"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="parentId"
        label="名称"
        width="150"
        >
        <template slot-scope="scope">
          <el-select 
          v-model="scope.row.entityTypeId" palceholder="" filterable clearable v-if="scope.row.isPage == 0"  @change="scope.row.hasChanged = true">
            <el-option
              v-for="item in getEntityTypeList(scope.row.entityTypeId)"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
          <div v-else>
            <el-select v-model="scope.row.routerId" filterable clearable @change="scope.row.hasChanged = true">
              <el-option
                v-for="item in routerList"
                :key="item.id"
                :label="item.name || item.routePath"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="op"
        label="显示类型"
        >
        <template slot-scope="scope">
          <el-select v-model="scope.row.showType" @change="scope.row.hasChanged = true" placeholder="无" filterable clearable>
          <el-option
            v-for="item in opShowType"
            :key="item.key"
            :label="item.label"
            :value="item.key">
          </el-option>
        </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="显示角色"
        >
        <template slot-scope="scope">
          <div v-if="scope.row.showType === 'roles'" >
            <el-select v-model="scope.row.roleIds" placeholder="所有角色" multiple filterable clearable>
              <el-option
                v-for="item in roleList"
                :key="item.key"
                :label="item.label"
                :value="item.key">
              </el-option>
            </el-select>
          </div>
          <div v-else>所有角色</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="排序值"
        width="80"
        >
        <template slot-scope="scope">
          <el-input-number :controls="false" v-model.number="scope.row.order" @change="scope.row.hasChanged = true"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="操作"
        width="280"
        >
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="save(scope.row)" v-show="scope.row.hasChanged">保存</el-button>
          <!-- <el-button type="success" size="small" @click="addSub(scope.row)" v-if="scope.row.isPage == 0">添加子菜单</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id, scope.$index)" v-if="scope.row.children.length === 0">删除</el-button> -->
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
          v-if="scope.row.isPage == 0"
          :data="scope.row.children"
            border
            stripe
            >
            <el-table-column
              prop="name"
              label="路由"
              >
              <template slot-scope="subScope">
                <el-select v-model="subScope.row.routerId" filterable clearable @change="scope.row.hasChanged = true">
                  <el-option
                    v-for="item in filterRouteListByType(scope.row.entityTypeId)"
                    :key="item.id"
                    :label="item.name || item.routePath"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="显示名称"
              >
              <template slot-scope="subScope">
                <el-input v-model="subScope.row.name" @change="scope.row.hasChanged = true"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="op"
              label="显示类型"
              >
              <template slot-scope="subScope">
                <el-select v-model="subScope.row.showType"  @change="scope.row.hasChanged = true"placeholder="无" filterable clearable>
                <el-option
                  v-for="item in opShowType"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="key"
              label="显示角色"
              >
              <template slot-scope="subScope">
                <div v-if="subScope.row.showType === 'roles'" >
                  <el-select v-model="subScope.row.roleIds" placeholder="所有角色" multiple filterable clearable>
                    <el-option
                      v-for="item in roleList"
                      :key="item.key"
                      :label="item.label"
                      :value="item.key">
                    </el-option>
                  </el-select>
                </div>
                <div v-else>所有角色</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="key"
              label="操作"
              >
              <template slot-scope="childScope">
                <el-button v-if="childScope.$index > 0" size="small" type="info" @click="move(scope.row, childScope.$index, 'up')">上移</el-button>
                <el-button v-if="childScope.$index < scope.row.children.length - 1" size="small" type="info" @click="move(scope.row, childScope.$index, 'down')">下移</el-button>
                <el-button type="danger" size="small" @click="removeSub(scope.row, childScope.$index, childScope.row.name)">删除</el-button>

              </template>
            </el-table-column>
            
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./list.js"></script>
