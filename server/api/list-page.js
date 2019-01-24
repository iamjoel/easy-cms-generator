const apiFormat = require('../utils/apiFormat')
const generatorCode = require('./utils/generator-code/front-end/list-page')
const tableName = 'listPage'
const commonCRUD = require('./utils/commonCRUD.js')(tableName)
const guidFn = require('../utils/guid')
const syncConfig = require('./config').sync

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
    try {
      removeService(req.params.id)
      res.send(apiFormat.success())
    } catch(error) {
      res.send(apiFormat.error(error))
    }
  },
  removeService(id, notDeleteFile) {
    return removeService(id, notDeleteFile)
  },
  // 根据配置，展开代码，保存到文件
  expendCofigToFile(id) {
    expendCofigToFile(id)

  },
  eject(req, res) {
    try {
      var id = req.params.id
      var page = global.db
                    .get(tableName)
                    .find({
                      id
                    })
                    .value()
      expendCofigToFile(id, true)
      removePrevFiles(page)
      updateRoute()
      res.send(apiFormat.success())
    } catch(error) {
      res.send(apiFormat.error(error))
    }

  }
}

function removePrevFiles(page) {
  var codePath = `${global.feCodeRootPath}/src/auto/views/${page.basic.codePath}`
  fs.remove(`${codePath}/List.vue`)
  fs.remove(`${codePath}/list.js`)

}

function updateRoute() {
  var listPageList = global.db.get('listPage').value()
  var updatePageList = global.db.get('updatePage').value()
  var router = global.db.get('router').value()

  var res = []
  router.forEach(item => {
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
  var filePath = `${global.feCodeRootPath}/src/auto/setting/base/router.js`
  fs.outputFileSync(filePath, 'export default ' + JSON.stringify(res, null, '\t'))
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

function removeService(id, notDeleteFile) {
  var page = global.db
                    .get(tableName)
                    .find({
                      id
                    })
                    .value()

  if(!page) {
    return
  }
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

    // 删除页面
    global.db
        .get(tableName)
        .remove({
          id,
        })
        .write()
    if(!notDeleteFile) {
      removePrevFiles(page)
    }

    // 删除路由
    global.db
          .get('router')
          .remove({
            entityId: entity.id,
            pageType: 'list'
          })
          .write()
    syncConfig('router')

    // 删菜单
    global.db.set('menu', menu).write()
    syncConfig('menu')
    
    var foldPath = `${global.feCodeRootPath}/src/auto/views/${page.basic.codePath}`
    return foldPath
  }
}

function expendCofigToFile(id, isEjected) {
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
  var codePath = `${global.feCodeRootPath}/src/${!isEjected ? 'auto/' : ''}views/${config.basic.codePath}`
  if(isEjected) {
    global.db
        .get(tableName)
        .find({
          id
        })
        .assign({
          updateAt: Date.now(),
          isEjected: true
        })
        .write()
  }
  
  writeFile(`${codePath}/List.vue`, vue)
  writeFile(`${codePath}/list.js`, js)
}

function writeFile(filePath, content) {
  fs.outputFileSync(filePath, content)
}

function formatCodePath(codePath) {
  return codePath.charAt(0) === '/' ? codePath.substr(1) : codePath
}

