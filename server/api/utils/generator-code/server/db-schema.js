module.exports = function (tableName, entityList, commonCols) {
  var res = 
`
DROP SCHEMA IF EXISTS \`${tableName}\`;
CREATE SCHEMA \`${tableName}\`;
use \`${tableName}\`;

SET FOREIGN_KEY_CHECKS=0;
${entityList.map(entity => {
  let res = `
${generatorTable(entity, commonCols)}`
  return res
}).join('\n')}`
  // todo 多对多的关系也要创建表
  return res
}

function generatorTable(entity, commonCols = []) {
  var name = entity.basic.name
  var cols = [
              ...commonCols.filter(item => item.key !== 'id'),
              ...entity.cols
            ]

  var res = 
`
-- ----------------------------
-- Table structure for ${name}
-- ----------------------------
DROP TABLE IF EXISTS \`${name}\`;
CREATE TABLE \`${name}\` (
  \`id\` varchar(36) NOT NULL,${cols && cols.length > 0 ? cols.map(col => {
  let res = 
  `${generatorCol(col)}`
  return res
}).join(',') + ',' : ''}${entity.relationList && entity.relationList.length > 0 ? '\n  ' + entity.relationList.filter(relation => relation.type !== 'moreToMore').map(relation => {
  let res = 
  `\`${relation.relateEntity}Id\` COMMENT '关联${relation.name}表'`
  return res
}).join(',') + ',' : ''}
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

`
  return res
}

function generatorCol(col) {
  var content = `\`${col.key}\` `
  switch(col.dataType) {
    case 'string': 
      content += `varchar(${col.maxLength || 20})`
      break;
    case 'text': 
      content += `text`
      break;
    case 'int': 
      content += `int(11)`
      break;
    case 'double':
      content += `decimal(10, 2)`
      break;
    case 'bool':
      content += `int(1)`
      break;
    case 'date': 
    case 'datetime': 
      content += `datetime`
      break;
    default: 
      console.log(`未知类型${col.dataType}。 col: ${col}`)
      throw `未知类型${col.dataType}`
  }
  content += ` ${col.required ? 'NOT NULL' : 'DEFAULT NULL'} COMMENT '${col.label}'`
  var res = 
`\n  ${content}`
  return res
}

