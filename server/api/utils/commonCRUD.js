const guidFn = require('../../utils/guid')
const apiFormat = require('../../utils/apiFormat')

module.exports = function (tableName) {
  var sortKey = 'updateAt'
  var sortType = 'desc' // 降序

  var shouldOrderTable = ['menu', 'entity', 'entityType', 'router']
  if(shouldOrderTable.indexOf(tableName) !== -1) {
    sortKey = 'order'
    sortType = 'asc' // 升序
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
        console.log(req.body)
        global.db
            .get(tableName)
            .push(Object.assign({
              id: guidFn(),
              updateAt: Date.now()
            }, req.body))
            .write()
        setNotSynced(tableName)
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
        setNotSynced(tableName)
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
        setNotSynced(tableName)
        res.send(apiFormat.success())
      } catch(error) {
        res.send(apiFormat.error(error))
      }
    }
  }
}

function setNotSynced(tableName) {
  global.db
      .get('syncStatus')
      .assign({
        [tableName]: false
      })
      .write()
}