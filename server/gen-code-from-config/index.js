var {currProject, commonCols} = require('./config')
const dbConfig = require(`../project-data/${currProject}/config`).db
const tableList = require(`../project-data/${currProject}/table`)
const dbSchemaTool = require('../api/utils/generator-code/server/db-schema')

// 生成 DDL
var ddl = dbSchemaTool(currProject, tableList, commonCols, true)
console.log(ddl)

// 生成 测试数据

// 执行 SQL
var mysql      = require('mysql');
var connection = mysql.createConnection({
  ...dbConfig,
  multipleStatements: true // 允许执行多条语句
});

connection.query(ddl, function (error, results, fields) {
  if (error) throw error;
})

connection.end()
// 生成 服务端代码

// 生成移动端代码
