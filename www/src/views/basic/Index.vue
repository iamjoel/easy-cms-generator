<template>
  <div class="main">
    <el-tabs v-model="activeName" @tab-click="handleChange">
      <el-tab-pane label="项目信息" name="info">
        <div class="row">
          <div class="label">项目根路径:</div>
          <div>
            <div v-if="projectRootPath">
              {{projectRootPath}}
              <el-button type="primary" size="small" @click="editProjectRootPath">修改</el-button>
            </div>
            <div class="ly ly-m " v-else>
              <el-input 
                v-model="tempProjectRootPath"
                @key-up.enter="confirmProjectRootPath"
                placeholder="请输入项目根路径"
                class="mr-10"
                style="width: 400px"
              />
              <el-button type="primary" size="small" @click="confirmProjectRootPath">确定</el-button>
              <el-button type="info" size="small" @click="cancelProjectRootPath">取消</el-button>
            </div>
          </div>
        </div>
        <div v-if="projectRootPath">
          <div class="row">
            <div class="label">项目名:</div>
            <div>{{projectName}}</div>
          </div>
          <div class="row">
            <div class="label">管理后台前端文件名:</div>
            <div>
              {{projectRootPath}}/admin
              <el-button 
                v-if="!hasAdminFolder"
                @click="createFolder('admin')"
                type="primary"
                size="small" >创建</el-button>
            </div>
          </div>
          <div class="row">
            <div class="label">服务端文件名:</div>
            <div>
              {{projectRootPath}}/server
              <el-button 
                v-if="!hasServerFolder"
                @click="createFolder('server')"
                type="primary"
                size="small"
              >创建</el-button>
            </div>

          </div>
          <div class="row">
            <div class="label">配置文件储存地址:</div>
            <div>{{dbPath}}</div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="字典" name="dict">
        <dict-list />
      </el-tab-pane>
      <el-tab-pane label="角色" name="role">
        <role-list />
      </el-tab-pane>
    </el-tabs>
   
  </div>
</template>

<script src="./main.js"></script>
<style scoped src="./style.css"></style>