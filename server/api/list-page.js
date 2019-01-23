const apiFormat = require('../utils/apiFormat')
const generatorCode = require('./utils/generator-code/front-end/list-page')
const tableName = 'listPage'
const commonCRUD = require('./utils/commonCRUD.js')(tableName)
const guidFn = require('../utils/guid')

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
    try {
      addService(req.body)
      res.send(apiFormat.success())
    } catch(error) {
      res.send(apiFormat.error(error))
    }
  },
  addService(data) {
    addService(data)
  },
  edit(req, res, pool) {
    try {
      editService(req.body, req.params.id)
      res.send(apiFormat.success())
    } catch(error) {
      res.send(apiFormat.error(error))
    }
  },
  editService(data, id) {
    editService(data, id)
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
  expendCofigToFile(id) {
    expendCofigToFile(id)
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

function addService(data) {
  var id = guidFn()
  global.db
          .get(tableName)
          .push(Object.assign({
            id,
            updateAt: Date.now()
          }, data))
          .write()
  expendCofigToFile(id)
}

function editService(data, id) {
  global.db
        .get(tableName)
        .find({
          id,
        })
        .assign(data)
        .assign({
          updateAt: Date.now()
        })
        .write()
  expendCofigToFile(id)
}

function expendCofigToFile(id) {
  var config = global.db
                  .get(tableName)
                  .find({
                    id
                  })
                  .value()
  if(!config) {
    console.error('找不到配置')
    return
  }
  var {vue, js} = generatorCode(config)
  var codePath = `${global.feCodeRootPath}/src/views/${config.basic.codePath ? config.basic.codePath : config.basic.entity}`

  writeFile(`${codePath}/List.vue`, vue)
  writeFile(`${codePath}/list.js`, js)
}

function writeFile(filePath, content) {
  fs.outputFileSync(filePath, content)
}

function formatCodePath(codePath) {
  return codePath.charAt(0) === '/' ? codePath.substr(1) : codePath
}

