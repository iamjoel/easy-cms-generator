const guidFn = require('../../utils/guid')
const apiFormat = require('../../utils/apiFormat')

module.exports = function (tableName) {
  var sortKey = 'updateAt'
  var sortType = 'desc' // 降序

  if(tableName === 'menu') {
    sortKey = 'order'
    sortType = 'asc'
  }
  return {
    list(req, res, pool) {
      try {
        var results = global.db.get(tableName)
                            .orderBy(sortKey, sortType)
                            .value()
        res.send(apiFormat.success(results))
      } catch(error) {
        res.send(apiFormat.error(error))
      }
    },
    detail(req, res, pool) {
      var results = global.db
                          .get(tableName)
                          .find({
                            id: req.params.id
                          })
                          .value()
      res.send(apiFormat.success(results))
    },
    add(req, res, pool) {
      try {
        global.db
            .get(tableName)
            .push(Object.assign({
              id: guidFn(),
              updateAt: Date.now()
            }, req.body))
            .write()
        res.send(apiFormat.success())
      } catch(error) {
        res.send(apiFormat.error(error))
      }
    },
    edit(req, res, pool) {
      try {
        global.db
            .get(tableName)
            .find({
              id: req.params.id,
            })
            .assign(req.body)
            .assign({
              updateAt: Date.now()
            })
            .write()
        res.send(apiFormat.success())
      } catch(error) {
        res.send(apiFormat.error(error))
      }
    },
    remove(req, res, pool) {
      try {
        global.db
            .get(tableName)
            .remove({
              id: req.params.id,
            })
            .write()
        res.send(apiFormat.success())
      } catch(error) {
        res.send(apiFormat.error(error))
      }
    }
  }
}