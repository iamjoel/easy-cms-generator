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

              <span v-if="!$store.state.adminInited">
                <span class="c-red">(未初始化)</span>
                <el-button type="primary" size="small" @click="showTip('admin')">初始化</el-button>
                <el-button type="primary" size="small" @click="check('admin')">检查</el-button>
              </span>
              <el-dialog 
                title="初始化步骤"
                :visible.sync="isShowAdminInitTipDialog"
              >
                
                <ol class="list">
                  打开终端，输入下面命令：
                  <li>cd {{projectRootPath}}/admin</li>
                  <li>vue init ~/front-end/template/front-end/vue-cli-admin</li>
                  <li>npm i 或 yarn install</li>
                </ol>
              </el-dialog>
              <!-- 应该默认创建 -->
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
              <span v-if="!$store.state.serverInited">
                <span class="c-red">(未初始化)</span>
                <el-button type="primary" size="small" @click="showTip('server')">初始化</el-button>
                <el-button type="primary" size="small" @click="check('server')">检测</el-button>
              </span>
              <el-dialog 
                title="初始化步骤"
                :visible.sync="isShowServerInitTipDialog"
              >
                
                <ol class="list">
                  打开终端，输入下面命令：
                  <li>cd {{projectRootPath}}/server</li>
                  <li>egg-init --template=/Users/jinweiqiang/front-end/template/server/node/egg-boilerplate</li>
                  <li>npm i 或 yarn install</li>
                </ol>
              </el-dialog>
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