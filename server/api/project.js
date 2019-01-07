const apiFormat = require('../utils/apiFormat')
const path = require('path')
const fs = require('fs-extra')
// Lowdb https://github.com/typicode/lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')



module.exports = {
  checkFoldsExist(req, res, pool) {
    var projectRootPath = req.query['root-path']
    var result 
    console.log(projectRootPath)
    try {
      result = {
        hasAdminFolder: fs.pathExistsSync(`${projectRootPath}/admin`),
        hasServerFolder: fs.pathExistsSync(`${projectRootPath}/server`),
      }
      res.send(apiFormat.success(result))
    } catch(error) {
      res.send(apiFormat.error(error))
    }
  },
  createFile(req, res) {
    try {
      fs.ensureDirSync(req.body.filePath)
      res.send(apiFormat.success({}))
    } catch(error) {
      res.send(apiFormat.error(error))
    }
  },
  choose(req, res) {
    try {
      var filePath = `data/${req.body.name}.json`
      var isDataFileExist = fs.pathExistsSync(filePath)
      if(!isDataFileExist) {
        fs.copySync('data/db.schema.json', filePath) // 复制模板
      }
      const adapter = new FileSync(`data/${req.body.name}.json`)
      const db = low(adapter)
      // 不要设置db.defaults。设置 default 导致 db.json 被间歇性的reload。导致开发时，服务器不断重启。。。
      global.db = db
      global.projectName = req.body.name
      global.feCodeRootPath = `${req.body.rootPath}/admin`
      global.serverCodeRootPath = `${req.body.rootPath}/server`

      res.send(apiFormat.success({
        dbPath: path.resolve(`data/${req.body.name}.json`)
      }))
    } catch(error) {
      res.send(apiFormat.error(error))
    }
    
  }
}

