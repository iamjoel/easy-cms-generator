var {currProject, commonCols} = require('./config')
const {db: dbConfig, serverLan } = require(`../project-data/${currProject}/config`)
const tableList = require(`../project-data/${currProject}/table`)
const dbSchemaTool = require('../api/utils/generator-code/server/db-schema')
const generatorTestDataTool = require('../api/utils/generator-code/server/generator-test-data')
var serverGen = require(`./server/${serverLan}`)

start()

function start() {
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


  // 生成 服务端代码
  serverGen()

  // 生成管理后台代码
  adminGen()
}

function adminGen() {

}

