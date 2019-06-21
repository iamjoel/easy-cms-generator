var {currProject, commonCols} = require('./config')
const {db: dbConfig, serverLan, type: projectType, dist} = require(`../project-data/${currProject}/config`)
const tableList = require(`../project-data/${currProject}/table`)

start()

function start() {
  if(projectType === 'all' || projectType === 'server') {
    // 注意：请先在数据库中执行 CREATE SCHEMA currProject
    // 数据操作。包括 生成DDL，测试数据，并执行。
    let dbGen = require('./db/index')
    dbGen(currProject, dbConfig, tableList, commonCols)

    // 生成 服务端代码
    let serverGen = require(`./server/${serverLan}/index`)
    switch(serverLan) {
      case 'node':
        serverGen(currProject, `${dist.server}`, tableList, commonCols)
        break;
    }
  }
  
  // 生成管理后台代码
  if(projectType === 'all' || projectType === 'admin') {
    let adminGen = require(`./admin/index`)
    adminGen()
  }
}

