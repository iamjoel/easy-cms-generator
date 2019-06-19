var squel = require("squel")
const guidFn = require('../../../../utils/guid')
var Random = require('mockjs').Random
const GEN_ITEM_NUM = 11 // 一页十条，可以测试分页
var date = new Date()

module.exports = generatorTestData
function generatorTestData(schema, entityList, commonCols) {
  schema = schema || global.projectName
  var res = []
  entityList = entityList || global.db.get('entity').value()
  commonColums = commonCols || global.db.get('entityConfig').value().commonCols
  commonColums = commonColums.filter(col => col.key !== 'id') // id是自增的

  entityList.forEach(entity => {
    var cols = [].concat(commonColums)
    cols = cols.concat(entity.cols)
    var relationList = entity.relationList
    var moreToMoreRelationList
    var singleRelationList

    if(relationList) {
      moreToMoreRelationList = entity.relationList.filter(relation => relation.type === 'moreToMore')
      singleRelationList = entity.relationList.filter(relation => relation.type !== 'moreToMore')
      if(singleRelationList.length > 0) {
        cols = cols.concat(singleRelationList.map(r => {
          return {
            key: `${r.relateEntity}Id`,
            dataType: 'int',
            len: 11
          }
        }))
      }
    }

    res.push(`-- Insert ${entity.basic.label || entity.basic.name}`)
    for(var i = 0; i < GEN_ITEM_NUM; i++) {
      let sql = squel.insert()
                    .into(`\`${schema}\`.${entity.basic.name}`)
      
      cols.forEach(col => {
          sql.set(col.key, genItem(col))
      })

      res.push(sql.toString() + ';')
    }

    // 多对多关联表
    if(moreToMoreRelationList && moreToMoreRelationList.length > 0) {
      moreToMoreRelationList.forEach(relation => {
        res.push(`-- Insert ${entity.basic.name}_${relation.relateEntity}_relation`)

        for(var i = 0; i < 5; i++) {
          let sql = squel.insert()
                        .into(`\`${schema}\`.${entity.basic.name}_${relation.relateEntity}_relation`)
          let cols = [].concat(commonColums)
          cols = cols.concat([{
            key: `${relation.relateEntity}Id`,
            dataType: 'int',
            len: 11
          },{
            key: `${entity.basic.name}Id`,
            dataType: 'int',
            len: 11
          },])
          cols.forEach(col => {
              sql.set(col.key, genItem(col))
          })

          res.push(sql.toString() + ';')
        }
      })
      
    }

    
  })
  return res.join('\n')
}

function genItem(col) {
  if(col.key === 'delFlg') {
    return 0 // 未删除
  }
  switch(col.dataType) {
    case 'string': 
      return Random.string('lower', 1, 10)
      break;
    case 'text': 
      return Random.paragraph()
      break;
    case 'int': 
      if(col.key.includes('Id')) { // 外键关联
        return Random.integer(1, GEN_ITEM_NUM - 1)
      }
      return Random.integer(1, 99)
      break;
    case 'double':
      return Random.float(1, 99)
      break;
    case 'bool':
      return Math.random() > 0.5 ? 1 : 0
      break;
    case 'date': 
    case 'datetime': 
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      break;
    default: 
      console.log(`未知类型${col.dataType}。 col: ${col}`)
      throw `未知类型${col.dataType}`
  }
}