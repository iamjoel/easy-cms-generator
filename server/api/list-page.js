const apiFormat = require('../utils/apiFormat')
const generatorCode = require('./utils/generatorListCode')
const tableName = 'listPage'

const commonCRUD = require

var config = require('../config')
const codePathPrefix = `${config.feCodeRootPath}/src/views`
const fs = require('fs-extra')

module.exports = {
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
      var codePath = `${codePathPrefix}/${config.basic.codePath ? config.basic.codePath : config.basic.entity}`
      Promise.all([
        writeFile(`${codePath}/List.vue`, vue),
        writeFile(`${codePath}/list.js`, js),
      ]).then(()=> {
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

