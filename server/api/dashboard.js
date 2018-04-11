var config = require('../config')
const apiFormat = require('../utils/apiFormat')
var fs = require('fs-extra')
const settingFileFoldPath = config.feCodeRootPath // 其实不是这个

module.exports = {
  detail(req, res, pool) {
    res.send(apiFormat.success({
      database: config.mysql.database,
      feCodeRootPath: config.feCodeRootPath
    }))
  },
  syncConfig(req, res, pool) {
    Promise.all([
      fetchList(pool, 'role'),
      fetchList(pool, 'dict'),
      fetchList(pool, 'entity'),
      fetchList(pool, 'list_page'),
      fetchList(pool, 'update_page'),
    ]).then(([role, dict, entity, listPage, updatePage]) => {
      Promise.all([
        writeConfigFile('roles', role),
        writeConfigFile('dict', dict),
        writeConfigFile('entities', entity),
        writeConfigFile('list-pages', listPage),
        writeConfigFile('update-pages', updatePage),
      ]).then(() => {
        res.send(apiFormat.success({}))
      })
    })
  },
  
}

function fetchList(pool, tableName) {
  var sql = `SELECT * from ${tableName}`
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

function writeConfigFile(name, content) {
  return new Promise((resolve, reject) => {
    var filePath = `${settingFileFoldPath}/${name}.js`
    fs.outputFile(filePath, 'export default ' + JSON.stringify(content, null, '\t'), err => {
        if(err) {
          reject(err)
          return
        }
        resolve()
      })
  })
}
