var config = require('../config')
const apiFormat = require('../utils/apiFormat')
var fs = require('fs-extra')
const deepClone = require('clone')
const generatorDBSchema = require('./utils/generator-code/server/db-schema.js')
const syncToServerCode = require('./utils/generator-code/server/server')

module.exports = {
  syncToProject(req, res) {
    try {
      doSyncToServerCode()
      res.send(apiFormat.success({}))
    } catch(e) {
      res.send(apiFormat.error(e))
    }
  },
  syncAllConfig() {
    syncAllConfig()
  },
  generatorDBSchema(req, res) {
    var entityData = global.db.get('entity')
                            .value()
    var commonCols = global.db.get('entityConfig')
                            .value()
                            .commonCols
    var schema = generatorDBSchema(global.projectName, entityData, commonCols)
    res.send(apiFormat.success(schema))
  }
  
}


function syncAllConfig() {
  var entityData = global.db.get('entity')
                            .value()
  var entityTypeList = global.db.get('entityType')
                          .value()
  entityData = entityData.map(entity => {
    var entityType = entityTypeList.filter(item => item.id === entity.basic.entityTypeId)[0]
    return {
      name: entity.basic.name,
      type: entityType ? entityType.key : false,
      isPublic: entity.basic.isPublic,
      isEjected: entity.isEjected
    }
  })
  // 同步 服务器端代码。包括 路由 和 modelMap。
  syncToServerCode(entityData) 
  
  // 同步代码到前端项目。
  sync('dict')
  sync('role')
  sync('entity')
  sync('router')
  try {
    sync('menu')
    console.log('sync menu')
  } catch(e) {
    console.log(`menu error: ${e}`)
  }
}

function sync(type) {
  switch(type) {
    case 'dict':
    case 'router':
      writeConfigFile(type, fetchList(type))
      break;
    case 'role':
      writeConfigFile('roles', fetchList('role'))
      break;
    case 'entity':
      writeConfigFile('entities', fetchList('entity'))
      break;
    case 'menu':
      var entity = fetchList('entity')
      var entityType = fetchList('entityType')
      var router = fetchList('router')
      var menu = fetchList('menu')
      writeConfigFile('menu', menu, [entity, entityType, router])
      break;
    default: 
      reject('未知类型！')
  }
  
}


function fetchList(tableName) {
  return global.db.get(tableName).value()
}

function writeConfigFile(name, content, [entityList, entityTypeList, router]=[]) {
  // 删除 对前端来说，不必要的字段
  content = content.map(item => {
    delete item.updateAt
    return item
  })
  switch(name) {
    case 'router':
      var res = []
      content.forEach(item => {
        res.push({
          routePath: item.routePath,
          filePath: item.filePath
        })
        // 根据更新页路由，添加详情页路由。
        if(item.type === 'update') {
          res.push({
            routePath: item.routePath.replace('/update', '/view'),
            filePath: item.filePath
          })
        }
      })

      content = res
      break;
    case 'menu': 
      var routerList = deepClone(router)

      content = content.map(item => {
        var res = {
          id: item.id,
          name: item.name,
          role: item.roleIds,
          routerId: item.routerId
        }
        if(item.isPage == 1) {
          let router = routerList.filter(each => {
            return each.id === item.routerId
          })[0]
          res.path = router ? router.routePath : ''
         
        } else {
          res.children = item.children.map(page => {
            return {
              id: page.routerId,
              name: page.name,
              path: routerList.filter(each => each.id === page.routerId)[0].routePath,
              role: item.roleIds
            }
          })
        }
        delete res.routerId
        return res
      })
      console.log(content)
      break;
  }
  
  var filePath = `${global.feCodeRootPath}/src/setting/base/${name}.js`
  fs.outputFileSync(filePath, 'export default ' + formatContent(content))
}

/*
* 将从数据库里拿出来的东西，一些没必要的移除
*/
function formatContent(content) {
  return JSON.stringify(content, null, '\t')
             // .replace(/\\"/g, '\'')
}