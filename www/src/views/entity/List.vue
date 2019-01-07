<template>
  <div class="main entity-and-its-type-page">
    <div class="ly ly-r mb-10">
      <el-button type="primary" @click="$router.push('/entity/update/-1')">新增</el-button>
    </div>
    <el-table
      :data="entityList"
      border
      stripe
    >
      <el-table-column
        type="index"
        label="序列"
        align="center"
        width="80">
      </el-table-column>
      
      <el-table-column
        prop="name"
        label="名称"
        >
      </el-table-column>
      <el-table-column
        prop="des"
        label="描述"
        >
      </el-table-column>
      
      <el-table-column
        prop="key"
        label="操作"
        >
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="$router.push('/entity/update/' + scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id, scope.$index, scope.$index.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./list.js">

</script>

<style scoped></style>