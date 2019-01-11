const guidFn = require('../utils/guid')
const apiFormat = require('../utils/apiFormat')
const tableName = 'entity'
const commonCRUD = require('./utils/commonCRUD.js')(tableName)

module.exports = {
  add(req, res, pool) {
    var id = guidFn()
    createPage(req.body.basic, id)
    commonCRUD.add(req, res, pool, id)
  },
  edit(req, res, pool) {
    createPage(req.body.basic, req.body.id)
    commonCRUD.edit(req, res, pool)
  },
  remove(req, res, pool) {
    removePage(req.params.id)
    commonCRUD.remove(req, res, pool)
  }
}

/*
* 将新增的实体，有条件的同步到 列表，更新页面。
* 同步条件：实体设置了有列表页/更新页，但列表或更新表没有那条数据，则创建。
* 不覆盖和删除。
*/
function createPage(data, entityId) {
  const entityName = data.name
  var entity = {
    id: entityId,
    name: entityName,
    type: data.type
  }
  if(data.hasListPage) {
    var hasListPage = global.db.get('listPage')
                            .filter(page => {
                              return page.basic.entity.id === entityId
                            })
                            .value()[0]
    if(!hasListPage) {
      global.db
        .get('listPage')
        .push(Object.assign({
          id: guidFn(),
          updateAt: Date.now()
        }, {
          "basic": {
            entity,
            "codePath": `${data.type ? `${data.type}/` : ''}${entityName}`
          }
        }))
        .write()
    }
  }

  if(data.hasUpdatePage) {
    var hasUpdatePage = global.db.get('updatePage')
                            .filter(page => {
                              return page.basic.entity.id === entityId
                            })
                            .value()[0]
    
    if(!hasUpdatePage) {
      global.db
        .get('updatePage')
        .push(Object.assign({
          id: guidFn(),
          updateAt: Date.now()
        }, {
          "basic": {
            entity,
            "codePath": `${data.type ? `${data.type}/` : ''}${entityName}`
          }
        }))
        .write()
    }
  }
}

/*
* 删除实体，删除对应的页面
* 待调试
*/
function removePage(entityId) {
  var hasListPage = global.db.get('listPage').filter(page => {
    return page.basic.entity.id === entityId
  }).value()[0]
  if(hasListPage) {
    global.db
    .get('listPage')
    .remove({
      id: hasListPage.id,
    })
    .write()
  }
  
  var hasUpatePage = global.db.get('updatePage').filter(page => {
    return page.basic.entity.id === entityId
  }).value()[0]
  if(hasUpatePage) {
    global.db
    .get('updatePage')
    .remove({
      id: hasUpatePage.id,
    })
    .write()
  }
}