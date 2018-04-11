<template>
<div id="topbar">
  <el-menu theme="dark" :default-active="'2'" mode="horizontal" id="sc-menu">
    <el-menu-item index="1">管理后台代码生成工具</el-menu-item>
  </el-menu>
</div>

</template>

<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      logout() {
        location.href='login.html'
      }
    }
  }
</script>

<style>
#topbar {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
}
.el-menu-item:hover{
  border-bottom:none !important;
}
</style>
