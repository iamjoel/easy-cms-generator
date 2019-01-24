const apiFormat = require('../utils/apiFormat')
const generatorCode = require('./utils/generator-code/front-end/update-page')
const tableName = 'updatePage'
const commonCRUD = require('./utils/commonCRUD.js')(tableName)
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

  },
  remove(req, res, pool) {
    try {
      removeService(req.params.id)
      res.send(apiFormat.success())
    } catch(error) {
      console.log(error)
      res.send(apiFormat.error(error))
    }
  },
  removeService(id, notDeleteFile) {
    return removeService(id, notDeleteFile)
  },
}

function removePrevFiles(page) {
  var codePath = `${global.feCodeRootPath}/src/auto/views/${page.basic.codePath}`
  fs.remove(`${codePath}/Update.vue`)
  fs.remove(`${codePath}/update.js`)
  fs.remove(`${codePath}/model.js`)
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
              pageType: 'update'
            })
            .write()
      syncConfig('router')

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
  var {vue, js, model} = generatorCode(config)
  var codePath = `${global.feCodeRootPath}/src/${!isEjected ? 'auto/' : ''}views/${config.basic.codePath ? config.basic.codePath : config.basic.entity}`
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
  writeFile(`${codePath}/Update.vue`, vue)
  writeFile(`${codePath}/update.js`, js)
  writeFile(`${codePath}/model.js`, model)
}

function writeFile(filePath, content) {
  fs.outputFileSync(filePath, content)
}

function formatCodePath(codePath) {
  return codePath.charAt(0) === '/' ? codePath.substr(1) : codePath
}

function parseKey(obj, parseKeyArr) {
  console.log(obj)
  var res = {}
  for(var key in obj) {
    if(parseKeyArr.indexOf(key) !== -1 && obj[key]) {
      res[key] = JSON.parse(obj[key])
    } else {
      res[key] = obj[key]
    }
  }
  
  return res
}