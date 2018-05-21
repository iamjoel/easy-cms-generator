

<template>
  <div class="main">
    <div class="row">
      <div class="label">数据库文件地址:</div>
      <div v-if="config.databaseFileName">项目目录/server/data/{{config.databaseFileName}}.json</div>
    </div>
    <div class="row">
      <div class="label">前端项目根路径:</div>
      <div>{{config.feCodeRootPath}}</div>
    </div>
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