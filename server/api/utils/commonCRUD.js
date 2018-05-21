const guidFn = require('../../utils/guid')
const apiFormat = require('../../utils/apiFormat')

module.exports = function (tableName) {
  return {
    list(req, res, pool) {
      try {
        var results = global.db.get(tableName).value()
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
              id: guidFn()
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