/*
* 生成 CRUD 操作。
*/
var fs = require('fs-extra')

module.exports = (modelList) => {
  return Promise.all([
    generatorRouter(modelList),
    generatorModelMap(modelList)
  ])
} 


function generatorRouter(modelList) {
  var routerPath = `${global.serverCodeRootPath}/app/auto-router.js` // 这时候 serverCodeRootPath 一定有

  var mainContent = modelList.map(model => {
    var modelSuffixPath = `${model.name}${model.type ? `/${model.type}` : ''}`
    var controllerPrefixPath = line2upper(`${model.name}${model.type ? `.${model.type}` : ''}`)
    var res =
`  router.get('/api/${modelSuffixPath}/list', jwt, controller.${controllerPrefixPath}.list)${model.isPublic ? `\n  router.get(\`/\${publicPrefix}/${modelSuffixPath}/list\`, controller.${controllerPrefixPath}.list)` : ''}
  router.get('/api/${modelSuffixPath}/detail/:id', jwt, controller.${controllerPrefixPath}.detail)${model.isPublic ? `\n  router.get(\`/\${publicPrefix}/${modelSuffixPath}/detail/:id\`, controller.${controllerPrefixPath}.detail)` : ''}
  router.post('/api/${modelSuffixPath}/add', jwt, controller.${controllerPrefixPath}.add)${model.isPublic ? `\n  router.post(\`/\${publicPrefix}/${modelSuffixPath}/add\`, controller.${controllerPrefixPath}.add)` : ''}
  router.post('/api/${modelSuffixPath}/edit', jwt, controller.${controllerPrefixPath}.edit)${model.isPublic ? `\n  router.post(\`/\${publicPrefix}/${modelSuffixPath}/edit\`, controller.${controllerPrefixPath}.edit)` : ''}
  router.post('/api/${modelSuffixPath}/del/:id', jwt, controller.${controllerPrefixPath}.del)${model.isPublic ? `\n  router.post(\`/\${publicPrefix}/${modelSuffixPath}/del/:id\`, controller.${controllerPrefixPath}.del)` : ''}`
    return res
  }).join('\n\n')

  var content =
`/*
* 代码生成工具生成的代码。
* 注意：请勿改动，会有被覆盖的风险。
*/
module.exports = function (router, controller) {
${mainContent}
}
`
  return writeFile(routerPath, content)
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

function generatorModelMap(modelList) {
  var modelMapPath = `${global.serverCodeRootPath}/config/auto-model-map.js`
  var mainContent = {}

  modelList.forEach(model => {
    mainContent[model.name] = `${model.type ? `${model.type}/` : ''}model/${model.name}`
  })

  var content =
`/*
* 代码生成工具生成的代码。
* 注意：请勿改动，会有被覆盖的风险。
*/
module.exports = ${JSON.stringify(mainContent, null, '  ')}
`
  return writeFile(modelMapPath, content)
}

function line2upper(str) {
  return str.replace( /[_|-]([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  })
}

function generatorEmptyModel(info) {
  const {modelName, modelPath} = info
  let dist = `app/service/${modelPath.join('/')}.js` // 从项目根路径开始算的

  const template = `
module.exports = {
  viewFields: [ 'name', ],
  validFields: [{
    key: 'name',
    name: '名称',
    rule: {
      type: 'string',
    },
    validType: 'all'
  }]
}`
  fs.outputFileSync(dist, template)
  console.log(`输出 Model 至: ${dist} 成功!`)
}


// 会写文件
function generatorService(info) {
  const {modelName, modelPrefix, modelSuffix} = info

  let dist = line2upper(`app/service/${modelPrefix.join('/')}/${modelSuffix.join('/')}.js`)
  var template = require('./template/service.js')

  fs.outputFileSync(dist, template)
  console.log(`输出 Service 至: ${dist}  成功!`)

}

// 会写文件
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




function getModelPathInfo (modelName) {
  const modelMap = require('../config/model-map.js')
  let modelPath = modelMap[modelName]
  if(!modelPath) {
    throw `请在 config/model-map.js 中配置: ${modelName}`
    return
  }
  modelPath = modelPath.split('/')
  var modelPrefix = []
  var modelSuffix = []
  var isFindModel = false
  modelPath.forEach(item => {
    if(isFindModel) {
      modelSuffix.push(item)
    } else {
      if(item === 'model') {
        isFindModel = true
      } else {
        modelPrefix.push(item)
      }
    }
  })
  
  return {modelPath, modelPrefix, modelSuffix}
}



