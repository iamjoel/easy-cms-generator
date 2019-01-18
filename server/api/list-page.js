const apiFormat = require('../utils/apiFormat')
const generatorCode = require('./utils/generatorListCode')
const tableName = 'listPage'
const commonCRUD = require('./utils/commonCRUD.js')(tableName)

var config = require('../config')
const fs = require('fs-extra')

module.exports = {
  list(req, res, pool) {
    commonCRUD.list(req, res, pool)
  },
  detail(req, res, pool) {
    commonCRUD.detail(req, res, pool)
  },
  add(req, res, pool) {
    commonCRUD.add(req, res, pool)
  },
  edit(req, res, pool) {
    commonCRUD.edit(req, res, pool)
  },
  remove(req, res, pool) {
    var page = global.db
                    .get(tableName)
                    .find({
                      id: req.params.id
                    })
                    .value()
    var entity = global.db
                        .get('entity')
                        .find({
                          id: page.basic.entity.id,
                        })
                        .value()
    
    if(entity) {
      var entityType = global.db
                        .get('entityType')
                        .find({
                          id: entity.entityTypeId
                        })
                        .value()
      var menu = global.db
                    .get('menu')
                    .value()
      var tarRouter = global.db
                        .get('router')
                        .find({
                          entityId: entity.id
                        })
                        .value()
      if(entityType) {
        var tarMenuItem
        var tarPages
        menu.forEach(item => {
          if(item.entityTypeId === entity.entityTypeId) {
            tarMenuItem = item
          }
        })

        if(tarMenuItem && tarMenuItem.children && tarMenuItem.children.length > 0) {
          tarMenuItem.children = tarMenuItem.children.filter(item => item.routerId !== tarRouter.id)
        }

      } else {
        menu = menu.filter(item => {
          return item.routerId !== tarRouter.id
        })
      }
      // 删菜单
      global.db.set('menu', menu).write()
      // 删除路由
       global.db
            .get('router')
            .remove({
              entityId: entity.id,
              pageType: 'list'
            })
            .write()
    }

    commonCRUD.remove(req, res, pool)
  },
  // 根据配置，展开代码，保存到文件
  expendCofigToFile(req, res, pool) {
    try {
      var config = global.db
                  .get(tableName)
                  .find({
                    id: req.params.id
                  })
                  .value()
      if(!config) {
        res.send(apiFormat.error({errMsg: '找不到配置'}))
        return
      }
      var {vue, js} = generatorCode(config)
      var codePath = `${global.feCodeRootPath}/src/views/${config.basic.codePath ? config.basic.codePath : config.basic.entity}`
      Promise.all([
        writeFile(`${codePath}/List.vue`, vue),
        writeFile(`${codePath}/list.js`, js),
      ]).then(()=> {
        // 将同步状态改为已同步
        global.db
          .get(tableName)
          .find({
            id: req.params.id,
          })
          .assign({
            isSynced: true,
            updateAt: Date.now()
          })
          .write()
        res.send(apiFormat.success())
      }, error => {
        res.send(apiFormat.error(error))
      })
    } catch(error) {
      res.send(apiFormat.error(error));
    }
  },
  updateFreeze(req, res, pool) {
    try {
      global.db
            .get(tableName)
            .find({
              id: req.params.id,
            })
            .assign({
              isFreeze: req.body.isFreeze
            })
            .write()
        res.send(apiFormat.success())
    } catch(error) {
      res.send(apiFormat.error(error));
    }
  }
}

function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.outputFile(filePath, content, err => {
      if(err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

function formatCodePath(codePath) {
  return codePath.charAt(0) === '/' ? codePath.substr(1) : codePath
}

