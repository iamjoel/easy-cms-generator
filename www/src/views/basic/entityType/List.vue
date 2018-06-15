<template>
  <div class="main">
    <div class="ly ly-r mb-10">
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
        prop="label"
        label="名称"
        >
        <template slot-scope="scope">
          <el-input v-model="scope.row.label" @change="scope.row.hasChanged = true"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="值"
        >
        <template slot-scope="scope">
          <el-input v-model="scope.row.key" @change="scope.row.hasChanged = true"></el-input>
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
        prop="key"
        label="操作"
        >
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="save(scope.row)" v-show="scope.row.hasChanged">保存</el-button>
          <el-button v-if="scope.row.id" type="success" size="small" @click="$router.push('/basic/entities/create/' + scope.row.id)">下一步</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./list.js">

</script>

<style scoped></style>