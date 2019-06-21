var {currProject, commonCols} = require('./config')
const {db: dbConfig, serverLan, type: projectType, dist} = require(`../project-data/${currProject}/config`)
const tableList = require(`../project-data/${currProject}/table`)
const dbSchemaTool = require('../api/utils/generator-code/server/db-schema')
const generatorTestDataTool = require('../api/utils/generator-code/server/generator-test-data')

start()

function start() {
  if(projectType === 'all' || projectType === 'server') {
    // 生成 DDL
    var ddl = dbSchemaTool(currProject, tableList, commonCols, true)
    // console.log(ddl)

    // 生成 测试数据
    var insertTestDataSql = generatorTestDataTool(currProject, tableList, commonCols)
    // console.log(insertTestDataSql)

    // 执行 SQL
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      ...dbConfig,
      multipleStatements: true // 允许执行多条语句
    });

    connection.query(ddl, function (error, results, fields) {
      if (error) throw error;
      connection.query(insertTestDataSql, function (error, results, fields) {
        if (error) throw error;
        console.log('测试数据插入完成！')
      })
      connection.end()
    })
    
    let serverGen = require(`./${serverLan}-server/index`)
    // 生成 服务端代码
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

