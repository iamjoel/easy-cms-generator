<template>
  <div class="main">
    <div class="ly ly-r mb-10">
      <el-button type="primary" @click="$router.push('/page/listPage/update/-1')">新增</el-button>
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
        prop="name"
        label="实体"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        label="已冻结"
        >
        <template slot-scope="scope">
          {{scope.row.isFreeze != 1 ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="操作"
        width="400"
        >
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="$router.push('/page/listPage/update/' + scope.row.id)" v-if="scope.row.isFreeze != 1">编辑</el-button>
          <el-button type="warning" size="small" @click="expendCofigToFile(scope.row.id)" v-if="scope.row.isFreeze != 1 && !scope.row.isSynced">展开代码到文件</el-button>
          <el-button type="warning"  v-if="!scope.row.basic.isCommon" size="small" @click="toggleFreeze(scope.row)">{{scope.row.isFreeze != 1 ? '冻结' : '解冻'}}</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./list.js">

</script>

<style scoped></style>