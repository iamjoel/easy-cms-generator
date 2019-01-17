<template>
<div class="main">
    <h1 class="mb-10 fw-b">实体的公共字段</h1>
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
        label="名称"
        >
      </el-table-column>
      <el-table-column
        prop="dataType"
        label="数据类型"
        >
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        >
      </el-table-column>
    </el-table>
</div>
</template>

<script>
  import {fetchList} from '@/service/api'
  export default {
    data () {
      return {
        list: []
      }
    },
    mounted() {
      fetchList('entity-common-cols').then(({data}) => {
        this.list = data.data
      })
    }
  }
</script>

<style>

</style>