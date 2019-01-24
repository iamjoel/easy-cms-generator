var squel = require("squel")
const guidFn = require('../../../../utils/guid')
var Random = require('mockjs').Random
const GEN_ITEM_NUM = 11 // 一页十条，可以测试分页

module.exports = generatorTestData
function generatorTestData() {

  var res = []
  var entityList = global.db.get('entity').value()
  var commonColums = global.db.get('entityConfig').value().commonCols
  
  entityList.forEach(entity => {
    var cols = [].concat(commonColums)
    cols = cols.concat(entity.cols)

    for(var i = 0; i < GEN_ITEM_NUM; i++) {
      let sql = squel.insert()
                    .into(`\`${global.projectName}\`.${entity.basic.name}`)
      
      cols.forEach(col => {
          sql.set(col.key, genItem(col))
      })

      res.push(sql.toString())
    }
    
  })
  return res.join('\n')
}

function genItem(col) {
  if(col.key === 'id') {
    return guidFn()
  } else if(col.key === 'delFlg') {
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
      return null
      break;
    default: 
      console.log(`未知类型${col.dataType}。 col: ${col}`)
      throw `未知类型${col.dataType}`
  }
}