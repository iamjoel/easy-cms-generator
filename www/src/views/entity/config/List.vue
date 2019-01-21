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
        prop="key"
        label="名称"
        >
      </el-table-column>
      <el-table-column
        prop="label"
        label="说明"
        >
      </el-table-column>
      <el-table-column
        prop="dataType"
        label="数据类型"
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