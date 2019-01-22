var config = require('../config')
const apiFormat = require('../utils/apiFormat')
var fs = require('fs-extra')
const deepClone = require('clone')
const generatorDBSchema = require('./utils/generator-code/server/db-schema.js')
const syncToServerCode = require('./utils/generator-code/server/server')

module.exports = {
  syncToProject(req, res) {
    doSyncToServerCode().then(() => {
      res.send(apiFormat.success({}))
    }, (e) => {
      res.send(apiFormat.error(e))
    })
  },
  doSyncToServerCode() {
    return doSyncToServerCode()
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


function doSyncToServerCode() {
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
    syncToServerCode(entityData) // 写服务器端代码。包括 路由 和 modelMap。

    // 同步代码到项目
    return Promise.all([
      sync('dict'),
      sync('role'),
      sync('entity'),
      sync('router'),
      sync('menu'),
    ])
}

function sync(type) {
  return new Promise((resolve, reject) => {
    switch(type) {
      case 'dict':
      case 'router':
        fetchList(type).then(data => {
          return writeConfigFile(type, data)
        }).then(() => {
          resolve()
        }, (e) => {
          reject(e)
        })
        break;
      case 'role':
        fetchList('role').then(data => {
          return writeConfigFile('roles', data)
        }).then(() => {
          resolve()
        }, (e) => {
          reject(e)
        })
        break;
      case 'entity':
        fetchList('entity').then(data => {
          return writeConfigFile('entities', data)
        }).then(() => {
          resolve()
        }, (e) => {
          reject(e)
        })
        break;
      case 'menu':
        Promise.all([
          fetchList('entity'),
          fetchList('entityType'),
          fetchList('router'),
          fetchList('menu'),
        ]).then(([entity, entityType, router, menu]) => {
          writeConfigFile('menu', menu, [entity, entityType, router]).then(() => {
            resolve()
          }, (e) => {
            reject(e)
          })
        }, (e) => {
          reject(e)
        })
        
        break;
      default: 
        reject('未知类型！')
    }
  })
  
}


function fetchList(tableName) {
  return new Promise((resolve, reject) => {
    resolve(global.db.get(tableName).value())
  })
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
      // 获取默认路由
      var routerList = deepClone(router).map(item => {
        var entity = entityList.filter(entity => item.entityId === entity.id)[0]
        var entityType = entity.parentId ? entityTypeList.filter(item => item.id === entity.parentId)[0] : false

        var defaultRouterPath = `${entityType ? `/${entityType.key}` : ''}/${item.entityId}/${item.type === 'list' ? 'list' : 'update/:id'}`
        
        return {
          id: item.id,
          routePath: item.routePath || defaultRouterPath
        }
      })
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
  }
  return new Promise((resolve, reject) => {
    var filePath = `${global.feCodeRootPath}/src/setting/base/${name}.js`
    fs.outputFile(filePath, 'export default ' + formatContent(content), err => {
        if(err) {
          reject(err)
          return
        }
        resolve()
      })
  })
}

/*
* 将从数据库里拿出来的东西，一些没必要的移除
*/
function formatContent(content) {
  return JSON.stringify(content, null, '\t')
             // .replace(/\\"/g, '\'')
}