<template>
  <div id="app">
    <j-topbar></j-topbar>
    <el-row :gutter="20" style="margin-top: 100px;">
      <el-col :span="4" style="min-height: 100px;">
        <j-siderbar :menu="menu"></j-siderbar>
      </el-col>
      <el-col :span="20">
        <!-- {{$store.getters.isProjectInited}} -->
        <div class="ly ly-r">
          <el-button type="success" @click="syncToProject">同步代码到项目</el-button>
        </div>
        <router-view id="main-content"></router-view>
      </el-col>
    </el-row>
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
      ]
    }
  },
  mounted() {
    // this.$store.commit(types.ROLE, role)
    // this.$store.commit(types.ROLE, 'admin')
    // this.$store.dispatch('fetchMenuAndLimit')
    // this.$store.dispatch('fetchBasicData')
  },
  methods: {
    syncToProject() {
      this.$http.post(`${SERVER_PREFIX}/config/sync-to-project`).then(({data}) => {
        this.$message({
          type: 'success',
          message: '同步成功!'
        })
      })
    }
  }
}
</script>
<style src="@/assets/reset.css"></style>
<style src="css-utils-collection"></style>
<style src="@/assets/common.css"></style>

