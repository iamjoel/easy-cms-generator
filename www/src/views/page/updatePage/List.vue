<template>
  <div class="main">
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
        prop="basic.entity.name"
        label="实体"
        >
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="$router.push('/entity/entity/update/' + scope.row.basic.entity.id)">{{scope.row.basic.entity.name}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="basic.des"
        label="已弹出"
        >
        <template slot-scope="scope">
          {{scope.row.isEjected ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="操作"
        width="400"
        >
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="$router.push('/page/updatePage/update/' + scope.row.id)" v-if="!scope.row.isEjected">编辑</el-button>
          <el-button type="warning" size="small" @click="eject(scope.row.id)" v-if="!scope.row.isEjected">弹出</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./list.js">

</script>

<style scoped></style>