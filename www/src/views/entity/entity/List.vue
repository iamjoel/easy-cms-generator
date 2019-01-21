<template>
  <div class="main entity-and-its-type-page">
    <div class="ly ly-r mb-10">
      <el-button type="primary" @click="$router.push('/entity/entity/update/-1')">新增</el-button>
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
        prop="entityTypeName"
        label="实体分类"
        >
      </el-table-column>
      <el-table-column
        prop="basic.name"
        label="名称"
        >
      </el-table-column>
      <el-table-column
        prop="basic.des"
        label="说明"
        >
      </el-table-column>
      
      <el-table-column
        prop="key"
        label="操作"
        width="400"
        >
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="$router.push('/entity/entity/update/' + scope.row.id)">编辑</el-button>
          <el-button 
            type="info" size="small"
            v-if="scope.row.basic.hasListPage"
            @click="$router.push('/page/listPage/update/' + scope.row.basic.listPageId)">列表页
          </el-button>

          <el-button 
            type="info" size="small"
            v-if="scope.row.basic.hasUpdatePage"
            @click="$router.push('/page/updatePage/update/' + scope.row.basic.updatePageId)">编辑页
          </el-button>

          <el-button type="warning" size="small" @click="expendCofigToFile(scope.row.id)" v-show="!scope.row.isSynced">展开代码到文件</el-button>

          <el-button type="danger" size="small" @click="remove(scope.row.id, scope.$index, scope.row.basic.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./list.js">

</script>

<style scoped></style>