const guidFn = require('../utils/guid')
const apiFormat = require('../utils/apiFormat')
const tableName = 'entity'
const commonCRUD = require('./utils/commonCRUD.js')(tableName)

module.exports = {
  list(req, res, pool) {
    try {
      var results = global.db.get(tableName)
                          .orderBy('order', 'asc')
                          .value()
      results = results.map(entity => {
        let entityType = global.db
                        .get('entityType')
                        .find({
                          id: entity.basic.entityTypeId
                        })
                        .value()
        let entityTypeName = entityType ? (entityType.label || '未命名') : '-'

        if(entity.basic.hasListPage) {
          let page = global.db
                        .get('listPage')
                        .filter(page => {
                          return page.basic.entity.id === entity.id
                        })
                        .value()[0]
          if(page) {
            entity.basic.listPageId = page.id
          }
        }

        if(entity.basic.hasUpdatePage) {
          let page = global.db
                        .get('updatePage')
                        .filter(page => {
                          return page.basic.entity.id === entity.id
                        })
                        .value()[0]
          if(page) {
            entity.basic.updatePageId = page.id
          }
        }
        return {
          ...entity,
          entityTypeName
        }
      })
      res.send(apiFormat.success(results))
    } catch(error) {
      res.send(apiFormat.error(error))
    }
  },
  detail(req, res, pool) {
    commonCRUD.detail(req, res, pool, req.params.id)
  },
  add(req, res, pool) {
    var id = guidFn()
    createPage(req.body.basic, id)

    commonCRUD.add(req, res, pool, id)
  },
  edit(req, res, pool) {
    createPage(req.body.basic, req.params.id)
    commonCRUD.edit(req, res, pool)
  },
  remove(req, res, pool) {
    removePage(req.params.id)
    commonCRUD.remove(req, res, pool)
  }
}

/*
* 将新增的实体，有条件的同步到 列表，更新页面 和对应的路由。
* 同步条件：实体设置了有列表页/更新页，但列表或更新表没有那条数据，则创建。
* 如果已有列表或更新页，不做覆盖和删除的处理。
*/
function createPage(data, entityId) {
  if(data.hasListPage) {
    addPageAndRoute(data, entityId, 'list')
  }

  if(data.hasUpdatePage) {
    addPageAndRoute(data, entityId, 'update')
  }
}

function addPageAndRoute(entityBasic, entityId, pageType) {
  const entityName = entityBasic.name
  var entity = { // 页面的entity
    id: entityId,
    name: entityName,
    entityTypeId: entityBasic.entityTypeId
  }

  var hasPage = global.db.get(`${pageType}Page`)
                            .filter(page => {
                              return page.basic.entity.id === entityId
                            })
                            .value().length > 0
  if(!hasPage) {
    var entityType = global.db
                        .get('entityType')
                        .find({
                          id: entity.entityTypeId
                        })
                        .value()

    // 新增页面
    global.db
      .get(`${pageType}Page`)
      .push(Object.assign({
        id: guidFn(),
        updateAt: Date.now()
      }, {
        "basic": {
          entity,
          "codePath": `${entityType ? `${entityType.key}/` : ''}${entityName}`
        }
      }))
      .write()
    
    // 新增路由
    global.db
      .get('router')
      .push({
        id: guidFn(),
        entityId,
        name: `${entityBasic.des}${pageType === 'list'? '列表页' : '更新页'}`,
        pageType,
        routePath: `${entityType ? `/${entityType.key}` : ''}/${entityName}/${pageType === 'list' ? 'list' : 'update/:id'}`,
        filePath: `${entityType ? `/${entityType.key}` : ''}/${entityName}/${pageType === 'list' ? 'List' : 'Update'}.vue`,
        updateAt: Date.now()
      })
      .write()
  }
}

/*
* 删除实体，删除对应的页面
*/
function removePage(entityId) {
  removePageAndRouter(entityId, 'list')
  removePageAndRouter(entityId, 'update')
}

function removePageAndRouter(entityId, pageType) {
  var hasPage = global.db.get(`${pageType}Page`).filter(page => {
    return page.basic.entity.id === entityId
  }).value()
  if(hasPage.length > 0) {
    // 删页面
    global.db
      .get(`${pageType}Page`)
      .remove({
        id: hasPage[0].id,
      })
      .write()

    // 删路由
    global.db
      .get('router')
      .remove({
        entityId,
      })
      .write()
  }
}