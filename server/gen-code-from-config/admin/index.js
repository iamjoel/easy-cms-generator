var fs = require('fs-extra')

function gen () {
  // 角色
  genRole()

  // 路由
  genRouter()

  // 前端的字典
  genDict()

  // 列表页
  genList()

  // 编辑页
  genUpdate()

  // 菜单
  genMenu()

  console.log('管理后台代码生成完成!\n')
}

function genRole() {

  console.log('01 生成角色完成\n')
}

function genRouter() {

  console.log('02 生成路由完成\n')
}

function genDict() {

  console.log('03 生成字典完成\n')
}

function genList() {

  console.log('04 生成列表页完成\n')
}

function genUpdate() {

  console.log('05 生成更新页\n')
}

function genMenu() {

  console.log('06 生成菜单完成\n')
}

module.exports = gen
