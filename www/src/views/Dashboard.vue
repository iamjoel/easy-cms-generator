

<template>
  <div class="main">
    <div class="row">
      <div class="label">数据库:</div>
      <div>{{config.database}}</div>
    </div>
    <div class="row">
      <div class="label">前端项目根路径:</div>
      <div>{{config.feCodeRootPath}}</div>
    </div>
    <el-button type="danger" @click="syncConfig" class="config-btn">同步所有配置到文件</el-button>
  </div>
</template>

<script>
import {SERVER_PREFIX} from '@/setting'
export default {
  data() {
    return {
      config: {}
    }  
  },
  methods: {
  },
  mounted() {
    this.$http.get(`${SERVER_PREFIX}/config/detail`).then(({data}) => {
      this.$set(this, 'config', data.data)
    })
  }
}
</script>

<style scoped>
  .row {
    display: flex;
    line-height: 1.5;
  }
  .label {
    margin-right: 10px;
    width: 200px;
    text-align: right;
  }
  .config-btn {
    margin-top: 10px;
    margin-left: 200px;
  }
</style>