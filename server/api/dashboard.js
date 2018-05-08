var config = require('../config')
const apiFormat = require('../utils/apiFormat')
var fs = require('fs-extra')
const deepClone = require('clone')


const settingFileFoldPath = `${config.feCodeRootPath}/src/setting/base` 
module.exports = {
  detail(req, res, pool) {
    res.send(apiFormat.success({
      database: config.mysql.database,
      feCodeRootPath: config.feCodeRootPath
    }))
  },
  syncAllConfig(req, res, pool) {
    Promise.all([
      fetchList(pool, 'role'),
      fetchList(pool, 'dict'),
      fetchList(pool, 'entity'),
      fetchList(pool, 'entity_type'),
      fetchList(pool, 'router'),
      fetchList(pool, 'menu'),
    ]).then(([role, dict, entity, entityType , router, menu]) => {
      Promise.all([
        writeConfigFile('roles', role),
        writeConfigFile('dict', dict),
        writeConfigFile('entities', entity),
        writeConfigFile('router', router),
        writeConfigFile('menu', menu, [entity, entityType, router]),
      ]).then(() => {
        res.send(apiFormat.success({}))
      }, (e) => {
        res.send(apiFormat.error(e))
      })
    },  (e) => {
      res.send(apiFormat.error(e))
    })
  },
  syncConfig(req, res, pool) {
    const type = req.params.type
    switch(type) {
      case 'dict':
      case 'router':
        fetchList(pool, type).then(data => {
          return writeConfigFile(type, data)
        }).then(() => {
          res.send(apiFormat.success({}))
        }, (e) => {
          res.send(apiFormat.error(e))
        })
        break;
      case 'role':
        fetchList(pool, 'role').then(data => {
          return writeConfigFile('roles', data)
        }).then(() => {
          res.send(apiFormat.success({}))
        }, (e) => {
          res.send(apiFormat.error(e))
        })
        break;
      case 'entity':
        fetchList(pool, 'entity').then(data => {
          return writeConfigFile('entities', data)
        }).then(() => {
          res.send(apiFormat.success({}))
        }, (e) => {
          res.send(apiFormat.error(e))
        })
        break;
      case 'menu':
        Promise.all([
          fetchList(pool, 'entity'),
          fetchList(pool, 'entity_type'),
          fetchList(pool, 'router'),
          fetchList(pool, 'menu'),
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

function fetchList(pool, tableName) {
  var sql = `SELECT * from ${tableName} ${tableName === 'menu' ?  'order by \`order\`': ''}`

  return new Promise((resolve, reject) => {
    pool.query(sql, function (error, results, fields) {
      if(error) {
        reject(error)
        return
      } else {
        resolve(results)
      }
    })
  })
}

function writeConfigFile(name, content, [entityList, entityTypeList, router]=[]) {
  // 将配置对象中一些字符串对象转化成对象。
  switch(name) {
    case 'dict':
      content = parseKey(content, ['value'])
      break;
    case 'list-pages':
      content = parseKey(content, ['basic', 'cols', 'operate', 'searchCondition', 'fn'])
      break;
    case 'update-pages':
      content = parseKey(content, ['basic', 'cols', 'fn'])
      break;
    case 'router':
      content = content.filter(item => {
        // 通用配置页不需要加到路由中
        if(item.type && item.type.indexOf('common') !== -1) {
          return false
        }
        return true
      }).map(item => {
        return {
          routePath: item.routePath,
          filePath: item.filePath
        }
      })
      break;
    case 'menu': 
      // 获取默认路由
      var routerList = deepClone(router).map(item => {
        var entity = entityList.filter(entity => item.entityId === entity.key)[0]
        var entityType = entity.parentId ? entityTypeList.filter(item => item.id === entity.parentId)[0] : false

        var defaultRouterPath
        if(!item.type || item.type.indexOf('common') === -1) {
          defaultRouterPath = `${entityType ? `/${entityType.key}` : ''}/${item.entityId}/${item.type === 'list' ? 'list' : 'update/:id'}`
        } else {
          defaultRouterPath = `/common
          ${entityType ? `/${entityType.key}` : ''}
          /${item.entityId}
          /${item.type.replace('common-', '') === 'list' ? 'list' : ':actionName/:id'}`.replace(/\s/g, '')
        }
        return {
          id: item.id,
          routePath: defaultRouterPath
        }
      })
      content = parseKey(content, ['children']).map(item => {
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

function parseKey(arr, parseKeyArr) {
  if(!parseKeyArr) {
    return arr
  }
  var res = arr.map(item => {
    var itemRes = {}
    for(var key in item) {
      if(parseKeyArr.indexOf(key) !== -1 && item[key]) {
        try {
          itemRes[key] = JSON.parse(item[key])
        } catch(e) {
          itemRes[key] = item[key]
        }
      } else {
        itemRes[key] = item[key]
      }
    }
    return itemRes
  })
  return res
}
/*
* 将从数据库里拿出来的东西，一些没必要的移除
*/
function formatContent(content) {
  return JSON.stringify(content, null, '\t')
             // .replace(/\\"/g, '\'')
}
