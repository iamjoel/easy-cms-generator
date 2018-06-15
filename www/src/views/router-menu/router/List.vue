<template>
  <div class="main">
    <div class="ly ly-r mb-10">
      <el-button type="success" @click="sync" v-show="!isSynced">同步</el-button>
      <el-button type="primary" @click="add">新增</el-button>
    </div>
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
        prop="entityTypeName"
        label="实体类型"
        >
      </el-table-column>
      <el-table-column
        prop="entityId"
        label="实体"
        >
        <template slot-scope="scope">
          <el-select v-model="scope.row.entityId" placeholder="请选择" filterable clearable @change="defaultChange(scope.row)">
            <el-option
              v-for="(item, i) in getEntity(scope.row.entityId)"
              :key="i"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        >
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" placeholder="请选择" filterable clearable @change="defaultChange(scope.row)">
            <el-option
              v-for="item in typeList"
              :key="item.key"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        >
        <template slot-scope="scope">
          <el-input v-model="scope.row.name"
          :placeholder="scope.row.namePlaceholder" @change="scope.row.hasChanged = true"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="order"
        label="排序"
        >
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.order" @change="scope.row.hasChanged = true"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="op"
        label="操作"
        width="200"
        >
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="save(scope.row)" v-show="scope.row.hasChanged">保存</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./list.js"></script>

<style scoped></style>