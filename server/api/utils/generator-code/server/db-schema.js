module.exports = function (tableName, entityList, commonCols) {
  var res = 
`
DROP SCHEMA IF EXISTS \`${tableName}\`;
CREATE SCHEMA \`${tableName}\`;
use \`${tableName}\`;

SET FOREIGN_KEY_CHECKS=0;
${entityList.map(entity => {
  let res = `
${generatorTable(entity, commonCols)}${generatorMoreToMoreTable(entity, commonCols)}`
  return res
}).join('\n')}`
  return res
}

function generatorTable(entity, commonCols = []) {
  var name = entity.basic.name
  var cols = [
              ...entity.cols,
              ...commonCols.filter(item => item.key !== 'id'),
            ]
  var tarRelationList = entity.relationList.filter(relation => relation.type !== 'moreToMore')
  var res = 
`-- ----------------------------
-- Table structure for ${name}
-- ----------------------------
DROP TABLE IF EXISTS \`${name}\`;
CREATE TABLE \`${name}\` (
  \`id\` INT(10) comment 'id' AUTO_INCREMENT${cols && cols.length > 0 ? ',' + cols.map(col => {
  let res = 
  `${generatorCol(col)}`
  return res
}).join(',') + ',' : ''}${entity.relationList && tarRelationList.length > 0 ? '\n  ' + tarRelationList.map(relation => {
  let res = 
  `\`${relation.relateEntity}Id\` COMMENT '关联${relation.name}表'` // 一对一，一对多
  return res
}).join(',') + ',' : ''}
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;`
  return res
}

function generatorMoreToMoreTable(entity, commonCols) {
  var res
  res = entity.relationList.filter(relation => relation.type === 'moreToMore')
                          .map(relation => {
                            let name = `${entity.basic.name}_${relation.relateEntity}`
                            var cols = commonCols.filter(item => item.key !== 'id')
                            var res = 
`
-- ----------------------------
-- Table structure for ${name}
-- ----------------------------
DROP TABLE IF EXISTS \`${name}\`;
CREATE TABLE \`${name}_relation\` (
  \`id\` varchar(36) NOT NULL,
  \`${entity.basic.name}Id\` varchar(36) NOT NULL,
  \`${relation.relateEntity}Id\` varchar(36) NOT NULL${cols && cols.length > 0 ? ',' + cols.map(col => {
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

