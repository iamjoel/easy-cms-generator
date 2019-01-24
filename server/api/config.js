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
  sync('menu')
}

function sync(type) {
  switch(type) {
    case 'dict':
      writeConfigFile('dict', fetchList(type))
      break;
    case 'router':
      var listPage = fetchList(`listPage`)
      var updatePage = fetchList(`updatePage`)
      writeConfigFile('router', fetchList(type), [null, null, null, listPage, updatePage])
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

function writeConfigFile(name, content, [entityList, entityTypeList, router, listPageList, updatePageList]=[]) {
  // 删除 对前端来说，不必要的字段
  content = content.map(item => {
    delete item.updateAt
    return item
  })
  switch(name) {
    case 'router':
      var res = []
      content.forEach(item => {
        var pageList = item.pageType === 'list' ? listPageList : updatePageList
        var isEjected = !!pageList.filter(page => page.id === item.pageId)[0].isEjected

        res.push({
          routePath: item.routePath,
          filePath: item.filePath,
          isEjected
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
          if(!res.path) {
            console.error(`${res.name} not has Route`)
          }
        } else {
          res.children = item.children.map(subMenu => {
            let router = routerList.filter(each => each.id === subMenu.routerId)[0]
            let path
            if (router) {
              path = router.routePath
            } else {
              console.error(`${subMenu.name} not has Route`)
            }
            return {
              id: subMenu.routerId,
              name: subMenu.name,
              path,
              role: item.roleIds
            }
          })
        }
        delete res.routerId
        return res
      })
      break;
  }
  
  var filePath = `${global.feCodeRootPath}/src/auto/setting/base/${name}.js`
  fs.outputFileSync(filePath, 'export default ' + formatContent(content))
}

/*
* 将从数据库里拿出来的东西，一些没必要的移除
*/
function formatContent(content) {
  return JSON.stringify(content, null, '\t')
             // .replace(/\\"/g, '\'')
}