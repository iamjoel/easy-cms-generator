<template>
  <div id="app">
    <j-topbar></j-topbar>
    <el-row :gutter="20" style="margin-top: 100px;">
      <el-col :span="4" style="min-height: 100px;">
        <j-siderbar :menu="menu"></j-siderbar>
      </el-col>
      <el-col :span="20">
        <!-- {{$store.getters.isProjectInited}} -->
        <div class="ly ly-r" style="margin-right: 15px;">
          <el-button type="info" @click="fetchDBSchema">显示数据库创建脚本</el-button>
          <el-button type="success" @click="fetchTestData">显示测试数据</el-button>
        </div>
        <router-view id="main-content" class="mt-10"></router-view>
      </el-col>
    </el-row>

    <el-dialog 
      title="数据库Schema"
      :visible.sync="isShowDBSchemaDialog"
    >
      <pre>
{{dbSchema}}
      </pre>
    </el-dialog>

    <el-dialog 
      title="测试数据"
      :visible.sync="isShowTestDataDialog"
      size="full"
    >
      <pre>
{{testData}}
      </pre>
    </el-dialog>
  </div>
</template>

<script>
import Sidebar from '@/components/siderbar'
import Topbar from '@/components/topbar'
import Breadcrumb from '@/components/breadcrumb'
import * as types from '@/store/mutation-types'
import {SERVER_PREFIX} from '@/setting'

export default {
  name: 'app',
  components: {
    'j-siderbar': Sidebar,
    'j-topbar': Topbar,
    'j-breadcrumb': Breadcrumb,
  },
  data() {
    return {
      menu: [
        { "id": "home", "name": "基础设置", "path": "/basic/info", alwaysShow: true },
        { "id": "entity", "name": "实体", "path": "/entity/list/entity" },
        { "id": "page", "name": "生成页面", "path": "/page/list/list" },
        { "id": "menu", "name": "菜单", "path": "/menu/list" },
      ],
      dbSchema: null,
      isShowDBSchemaDialog: false,
      testData: null,
      isShowTestDataDialog: false,
    }
  },
  mounted() {
  },
  methods: {
    fetchDBSchema() {
      this.$http.get(`${SERVER_PREFIX}/config/db-schema`).then(({data}) => {
        this.dbSchema = data.data
        this.isShowDBSchemaDialog = true
      })
    },
    fetchTestData() {
      this.$http.get(`${SERVER_PREFIX}/entity-gen-data`).then(({data}) => {
        this.testData = data.data
        this.isShowTestDataDialog = true
      })
    }
  },

}
</script>
<style src="@/assets/reset.css"></style>
<style src="css-utils-collection"></style>
<style src="@/assets/common.css"></style>

