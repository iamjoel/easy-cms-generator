const dbSchemaTool = require('../../api/utils/generator-code/server/db-schema')
const generatorTestDataTool = require('../../api/utils/generator-code/server/generator-test-data')

function gen (currProject, dbConfig, tableList, commonCols) {
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
    console.log('01: 创建数据库成功!\n')
    if (error) throw error;
    connection.query(insertTestDataSql, function (error, results, fields) {
      if (error) throw error;
      console.log('02: 测试数据插入完成！\n')
    })
    connection.end()
  })

  console.log('数据库操作完成！')
}

module.exports = gen