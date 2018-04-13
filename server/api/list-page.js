const guidFn = require('../utils/guid')
const apiFormat = require('../utils/apiFormat')
const getUpdateSql = require('../utils/getUpdateSql')
const generatorCode = require('./utils/generatorListCode')
const tableName = 'list_page'

var config = require('../config')
const codePathPrefix = `${config.feCodeRootPath}/src/views`
const fs = require('fs-extra')

module.exports = {
  list(req, res, pool) {
    pool.query(`SELECT * from ${tableName}`, function (error, results, fields) {
      if (error) res.send(apiFormat.error(error));
      res.send(apiFormat.success(results))
    })
  },
  detail(req, res, pool) {
    var sql = `SELECT * from ${tableName} WHERE id = '${req.params.id}'`
    pool.query(sql, function (error, results, fields) {
      if (error) res.send(apiFormat.error(error));
      res.send(apiFormat.success(results))
    })
  },
  add(req, res, pool) {
    var guid = guidFn()
    var body = req.body
    var sql = `INSERT INTO ${tableName} (id, basic, cols, operate, searchCondition, fn) VALUES 
    ('${guid}', '${body.basic}', '${body.cols}','${body.operate}', '${body.searchCondition}','${body.fn}')`
    pool.query(sql, function (error, results, fields) {
      if (error) {
        res.send(apiFormat.error(error))
        return
      }
      res.send(apiFormat.success(results))
    })
  },
  edit(req, res, pool) {
    var updateSql = getUpdateSql(req.body)
    var sql = `UPDATE ${tableName} SET ${updateSql} WHERE id = '${req.params.id}'`
    pool.query(sql, function (error, results, fields) {
      if (error) {
        res.send(apiFormat.error(error))
        return
      }
      res.send(apiFormat.success(results))
    })
  },
  remove(req, res, pool) {
    pool.query(`DELETE from ${tableName} where id = '${req.params.id}'`, function (error, results, fields) {
      if (error) {
        res.send(apiFormat.error(error));
        return
      }
      res.send(apiFormat.success(results))
    })
  },
  // 根据配置，展开代码，保存到文件
  expendCofigToFile(req, res, pool) {
    var sql = `SELECT * from ${tableName} WHERE id = '${req.params.id}'`
    pool.query(sql, function (error, results, fields) {
      if (error) res.send(apiFormat.error(error));
      var config = results[0]
      if(!config) {
        res.send(apiFormat.error({errMsg: '找不到配置'}))
        return
      }
      config = parseKey(config, ['basic', 'cols', 'operate', 'searchCondition', 'fn'])

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
    })  
  },
  updateFreeze(req, res, pool) {
    var sql = `UPDATE ${tableName} SET isFreeze = '${req.body.isFreeze}' WHERE id = '${req.params.id}'`
    pool.query(sql, function (error, results, fields) {
      if (error) {
        res.send(apiFormat.error(error));
        return
      }
      res.send(apiFormat.success())
    })
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


function parseKey(obj, parseKeyArr) {
  var res = {}
  for(var key in obj) {
    if(parseKeyArr.indexOf(key) !== -1 && obj[key]) {
      try {
        res[key] = JSON.parse(obj[key])
      } catch(e) {
        console.log(key, e)
      }
    } else {
      res[key] = obj[key]
    }
  }
  
  return res
}