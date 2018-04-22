<template>
  <div class="main">
    <div class="ly ly-r mb-10">
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <el-table
    <el-table
      :data="list"
      border
      stripe>
      <el-table-column
        type="index"
        label="序列"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="parentId"
        label="父级"
        >
        <template slot-scope="scope">
          <el-select v-model="scope.row.parentId" palceholder="顶级" filterable clearable>
            <el-option
              v-for="item in parentList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="routerId"
        label="路由"
        >
        <template slot-scope="scope">

          <el-select v-model="scope.row.routerId" filterable clearable v-if="scope.row.parentId">
            <el-option
              v-for="item in routerList"
              :key="item.key"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        >
        <template slot-scope="scope">
          <el-input v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="op"
        label="显示类型"
        >
        <template slot-scope="scope">
          <el-select v-model="scope.row.showType" placeholder="无" filterable clearable>
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
          <el-input-number :controls="false" v-model.number="scope.row.order"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="操作"
        width="180"
        >
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="save(scope.row)">保存</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./list.js">

</script>

<style scoped></style>