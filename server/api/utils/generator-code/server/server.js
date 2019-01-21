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


