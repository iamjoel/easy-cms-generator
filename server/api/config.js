var config = require('../config')
const apiFormat = require('../utils/apiFormat')
var fs = require('fs-extra')
const deepClone = require('clone')

const settingFileFoldPath = `${config.feCodeRootPath}/src/setting/base`

module.exports = {
  detail(req, res) {
    res.send(apiFormat.success({
      databaseFileName: config.databaseFileName,
      feCodeRootPath: config.feCodeRootPath
    }))
  },
  syncConfig(req, res) {
    const type = req.params.type
    switch(type) {
      case 'dict':
      case 'router':
        fetchList(type).then(data => {
          return writeConfigFile(type, data)
        }).then(() => {
          res.send(apiFormat.success({}))
        }, (e) => {
          res.send(apiFormat.error(e))
        })
        break;
      case 'role':
        fetchList('role').then(data => {
          return writeConfigFile('roles', data)
        }).then(() => {
          res.send(apiFormat.success({}))
        }, (e) => {
          res.send(apiFormat.error(e))
        })
        break;
      case 'entity':
        fetchList('entity').then(data => {
          return writeConfigFile('entities', data)
        }).then(() => {
          res.send(apiFormat.success({}))
        }, (e) => {
          res.send(apiFormat.error(e))
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
            res.send(apiFormat.success({}))
          }, (e) => {
            res.send(apiFormat.error(e))
          })
        }, (e) => {
          res.send(apiFormat.error(e))
        })
        break;
      default: 
        res.send(apiFormat.error('未知类型！'))
    }
  }
  
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
          res.path = routerList.filter(each => {
            return each.id === item.routerId
          })[0].routePath
         
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
    var filePath = `${settingFileFoldPath}/${name}.js`
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
