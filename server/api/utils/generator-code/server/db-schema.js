module.exports = function (schema, entityList, commonCols, notWritToDB) {
  var res = 
`
${!notWritToDB ?
`DROP SCHEMA IF EXISTS \`${schema}\`;
CREATE SCHEMA \`${schema}\`;
use \`${schema}\`;

SET FOREIGN_KEY_CHECKS=0;`
: ''}
${entityList.map(entity => {
  let res = `
${generatorTable(entity, commonCols, notWritToDB)}${generatorMoreToMoreTable(entity, commonCols)}`
  return res
}).join('\n')}`
  return res
}

function generatorTable(entity, commonCols = []) {
  var {name, label} = entity.basic
  var cols = [
              ...entity.cols,
              ...commonCols.filter(item => item.key !== 'id'),
            ]
  var tarRelationList = entity.relationList ? entity.relationList.filter(relation => relation.type !== 'moreToMore') : []
  var res = 
`
-- ----------------------------
-- Table structure for ${label || name}
-- ----------------------------

DROP TABLE IF EXISTS \`${name}\`;
CREATE TABLE \`${name}\` (
  \`id\` int(11) comment 'id' AUTO_INCREMENT${cols && cols.length > 0 ? ',' + cols.map(col => {
  let res = 
  `${generatorCol(col)}`
  return res
}).join(',') + ',' : ''}${entity.relationList && tarRelationList.length > 0 ? '\n  ' + tarRelationList.map(relation => {
  let res = 
  `\`${relation.relateEntity}Id\` int(11) COMMENT '关联${relation.name}表'` // 一对一，一对多
  return res
}).join(',') + ',' : ''}
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;`
  return res
}

function generatorMoreToMoreTable(entity, commonCols) {
  var res
  if(!entity.relationList || entity.relationList.length === 0) {
    return ''
  }
  res = entity.relationList.filter(relation => relation.type === 'moreToMore')
                          .map(relation => {
                            let name = `${entity.basic.name}_${relation.relateEntity}`
                            var cols = commonCols.filter(item => item.key !== 'id')
                            var res = 
`
-- ----------------------------
-- Table structure for ${name}_relation
-- ----------------------------
DROP TABLE IF EXISTS \`${name}_relation\`;
CREATE TABLE \`${name}_relation\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`${entity.basic.name}Id\` int(11) NOT NULL,
  \`${relation.relateEntity}Id\` int(11) NOT NULL${cols && cols.length > 0 ? ',' + cols.map(col => {
  let res = 
  `${generatorCol(col)}`
  return res
}).join(',') + ',' : ''}
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;`
                            return res
                          })
                          .join('\n')
  return res ? `\n${res}` : ''
}

function generatorCol(col) {
  var content = `\`${col.key || col.name}\` `
  switch(col.dataType) {
    case 'string': 
      content += `varchar(${col.maxLength || 50})`
      break;
    case 'text': 
      content += `text`
      break;
    case 'int': 
      content += `int(${col.len || 11})`
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

