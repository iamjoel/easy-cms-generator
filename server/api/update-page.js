const apiFormat = require('../utils/apiFormat')
const generatorCode = require('./utils/generator-code/front-end/update-page')
const tableName = 'updatePage'
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
    // 删除路由
    if(entity) {
       global.db
            .get('router')
            .remove({
              entityId: entity.id,
              pageType: 'update'
            })
            .write()
    }

    commonCRUD.remove(req, res, pool)
  },
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