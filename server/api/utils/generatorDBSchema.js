module.exports = function (tableName, entityList, commonCol) {
  var res = 
`
CREATE SCHEMA \`${tableName}\`;
use \`${tableName}\`;

SET FOREIGN_KEY_CHECKS=0;
${entityList.map(entity => {
  let res = `
${generatorTable(entity)}`
  return res
}).join('\n')}`

  return res
}

function generatorTable(entity) {
  var name = entity.basic.name
  var res = 
`
-- ----------------------------
-- Table structure for ${name}
-- ----------------------------
DROP TABLE IF EXISTS \`${name}\`;
CREATE TABLE \`${name}\` (
  \`id\` varchar(36) NOT NULL,${entity.cols.map(col => {
  let res = 
`    ${generatorCol(col)}`
  return res
}).join(',')},
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

`
  // console.log(res)
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
    case 'bool':
      content += `int(1)`
    case 'date': 
      content += `datetime`
      break;
    default: 
      console.log(`未知类型${col.dataType}`)
      throw `未知类型${col.dataType}`
  }
  content += ` ${col.required ? 'NOT NULL' : 'DEFAULT NULL'} COMMENT '${col.label}'`
  var res = 
`
${content}`
  return res
}