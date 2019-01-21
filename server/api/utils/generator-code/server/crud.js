var fs = require('fs-extra')

module.exports = function(entity, entityTypeName, commonCols) {
  return Promise.all([
    generatorModel(entity, entityTypeName)
  ])
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
  const {modelName, modelPrefix, modelSuffix} = info

  let dist = `${global.serverCodeRootPath}/app/service/${entityTypeName ? `${entityTypeName}/` : ''}${entity.basic.name}.js` // 从项目根路径开始算的
  
  var template = require('./template/service.js')

  fs.outputFileSync(dist, template)
  console.log(`输出 Service 至: ${dist}  成功!`)

}

function generatorController(info) {
  const {modelName, modelPrefix, modelSuffix} = info
  var modelPrefixPath = modelPrefix.join('/')
  var servicePath = line2upper(`${modelPrefix.join('.')}.${modelSuffix.join('.')}`)

  let dist = `app/controller/${modelPrefix.join('/')}/${modelSuffix.join('/')}.js`
  var template = require('./template/controller.js')
  template = template.replace(/{servicePath}/g, servicePath)

  fs.outputFileSync(dist, template)
  console.log(`输出 Controller 至: ${dist}  成功!`)
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