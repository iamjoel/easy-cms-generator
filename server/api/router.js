const guidFn = require('../utils/guid')
const apiFormat = require('../utils/apiFormat')
const getUpdateSql = require('../utils/getUpdateSql')

const tableName = 'router'
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
    var sql = `INSERT INTO ${tableName} (id, name, entityId, type, routePath, filePath) VALUES 
    ('${guid}', '${body.name}', '${body.entityId}','${body.type}','${body.routePath}','${body.filePath}')`
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
  }
}