<template>
  <div class="main">
      <el-tabs v-model="activeName" @tab-click="handleChange">
        <el-tab-pane label="实体" name="entity">
          <entity-list />
        </el-tab-pane>
        <el-tab-pane label="实体类型" name="entity-type">
          <entity-type-list />
        </el-tab-pane>
        <el-tab-pane label="公共列" name="common-col">
          <config />
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script src="./list.js"></script>

<style scoped></style>