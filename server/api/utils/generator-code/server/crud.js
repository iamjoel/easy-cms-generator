var fs = require('fs-extra')

module.exports = function(entity, entityTypeName, commonCols) {
  generatorModel(entity, entityTypeName)
  generatorService(entity, entityTypeName)
  generatorController(entity, entityTypeName)
}

function generatorModel(entity, entityTypeName, commonCols = []) {
  let dist = `${global.serverCodeRootPath}/app/service/${entityTypeName ? `${entityTypeName}/` : ''}model/${entity.basic.name}.js` // 从项目根路径开始算的

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

function generatorService(entity, entityTypeName) {
  let dist = `${global.serverCodeRootPath}/app/service/${entityTypeName ? `${entityTypeName}/` : ''}${entity.basic.name}.js` // 从项目根路径开始算的
  var template = require('./template/service.js')
  fs.outputFileSync(dist, template)
}

function generatorController(entity, entityTypeName) {
  var servicePath = line2upper(`${entityTypeName ? `${entityTypeName}.` : ''}${entity.basic.name}`)
  let dist = `${global.serverCodeRootPath}/app/controller/${entityTypeName ? `${entityTypeName}/` : ''}${entity.basic.name}.js`
  var template = require('./template/controller.js')
  template = template.replace(/{servicePath}/g, servicePath)
  fs.outputFileSync(dist, template)
}

function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    console.log(filePath)
    fs.outputFile(filePath, content, err => {
      if(err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}
function line2upper(str) {
  return str.replace( /[_|-]([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  })
}