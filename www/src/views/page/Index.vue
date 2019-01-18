<template>
  <div class="main">
    <el-tabs v-model="activeName" @tab-click="handleChange">
      <el-tab-pane label="列表页" name="list">
        <list-page-list />
      </el-tab-pane>
      <el-tab-pane label="更新页" name="update">
        <update-page-list />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script src="./main.js"></script>

<style scoped></style>