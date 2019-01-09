const guidFn = require('../utils/guid')
const apiFormat = require('../utils/apiFormat')
const tableName = 'entity'
const commonCRUD = require('./utils/commonCRUD.js')(tableName)


module.exports = {
  add(req, res, pool) {
    createPage(req.body.basic)
    commonCRUD.add(req, res, pool)
  },
  edit(req, res, pool) {
    createPage(req.body.basic)
    commonCRUD.edit(req, res, pool)
  }
}

/*
* 将新增的实体，有条件的同步到 列表，更新页面。
* 同步条件：实体设置了有列表页/更新页，但列表或更新表没有那条数据，则创建。
* 不覆盖和删除。
*/
function createPage(data) {
  const entityName = data.name
  if(data.hasListPage) {
    var hasListPage = global.db.get('listPage').filter(page => {
      return page.basic.entity === entityName
    })[0]
    
    if(!hasListPage) {
      global.db
        .get('listPage')
        .push(Object.assign({
          id: guidFn(),
          updateAt: Date.now()
        }, {
          "basic": {
            "entity": entityName, // 存id，冗杂个name吧。
            // "codePath": "account/account" //目录怎么处理？,一定要有分类？实体分类
          }
        }))
        .write()
    }
  }

  if(data.hasUpdatePage) {
    var hasUpdatePage = global.db.get('updatePage').filter(page => {
      return page.basic.entity === entityName
    })[0]
    
    if(!hasUpdatePage) {
      global.db
        .get('updatePage')
        .push(Object.assign({
          id: guidFn(),
          updateAt: Date.now()
        }, {
          "basic": {
            "entity": entityName,
            // "codePath": "account/account" //目录怎么处理？,一定要有分类？实体分类
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
function removePage() {
  var hasListPage = global.db.get('listPage').filter(page => {
      return page.basic.entity === entityName
    })[0]
    if(hasListPage) {
      global.db
      .get('listPage')
      .remove({
        id: hasListPage[0].id,
      })
      .write()
    }
    
}