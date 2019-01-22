var fs = require('fs-extra')

module.exports = function(entity, entityTypeName, commonCols, isEjected) {
  generatorModel(entity, entityTypeName, commonCols, isEjected)
  generatorService(entity, entityTypeName, isEjected)
  generatorController(entity, entityTypeName, isEjected)
  
  // 删除文件。
  if(isEjected) {
    fs.remove(`${global.serverCodeRootPath}/app/service/auto/${entityTypeName ? `${entityTypeName}/` : ''}model/${entity.basic.name}.js`)
    fs.remove(`${global.serverCodeRootPath}/app/service/auto/${entityTypeName ? `${entityTypeName}/` : ''}${entity.basic.name}.js`)
    fs.remove(`${global.serverCodeRootPath}/app/controller/auto/${entityTypeName ? `${entityTypeName}/` : ''}${entity.basic.name}.js`)
  }
}

function generatorModel(entity, entityTypeName, commonCols = [], isEjected) {
  let dist = `${global.serverCodeRootPath}/app/service/${!isEjected ? 'auto/' : ''}${entityTypeName ? `${entityTypeName}/` : ''}model/${entity.basic.name}.js` // 从项目根路径开始算的

  var basic = entity.basic
  var cols = entity.cols || []
  cols = [...commonCols, ...cols]

  var model = {
    viewFields: cols.map(col => col.key),
    validFields: cols.map(col => {
      var rule = { // https://github.com/node-modules/parameter
        required: col.required,
        type: `${getRuleType(col.dataType)}`
      }
      if(col.dataType === 'string') {
        rule.max = col.maxLength || 10
      }
      return {
        key: `${col.key}`,
        name: `${col.label}`,
        rule,
        validType: 'all'
      }
    })
  }

  const template = 
`module.exports = ${JSON.stringify(model, null, '  ')}`
  fs.outputFileSync(dist, template)

}

function getRuleType(type) {
  var res = {
    'string': 'string',
    'text': 'string',
    'int': 'int',
    'bool': 'int',
    'double': 'number',
    'date': 'number',
    'datetime': 'number',
  }[type]
  if(!res) {
    throw `Unknow Type: ${type}`
  }
  return res
}

function generatorService(entity, entityTypeName, isEjected) {
  let dist = `${global.serverCodeRootPath}/app/service/${!isEjected ? 'auto/' : ''}${entityTypeName ? `${entityTypeName}/` : ''}${entity.basic.name}.js` // 从项目根路径开始算的
  var template = require('./template/service.js')
  fs.outputFileSync(dist, template)
}

function generatorController(entity, entityTypeName, isEjected) {
  var servicePath = line2upper(`${!isEjected ? 'auto.' : ''}${entityTypeName ? `${entityTypeName}.` : ''}${entity.basic.name}`)
  let dist = `${global.serverCodeRootPath}/app/controller/${!isEjected ? 'auto/' : ''}${entityTypeName ? `${entityTypeName}/` : ''}${entity.basic.name}.js`
  var template = require('./template/controller.js')
  template = template.replace(/{servicePath}/g, servicePath)
  fs.outputFileSync(dist, template)
}


// 改成驼峰
function line2upper(str) {
  return str.replace( /[_|-]([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  })
}

