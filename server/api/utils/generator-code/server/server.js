/*
* 生成 CRUD 操作。
*/
var fs = require('fs-extra')

const WARN_TIP = 
`/*
* 代码生成工具生成的代码。
* 注意：请勿改动，会有被覆盖的风险。
*/`

module.exports = (modelList, config) => {
  generatorConfig(config)
  generatorRouter(modelList)
  generatorModelMap(modelList)
} 

// 数据库名称 之类的配置
function generatorConfig(config = {}) {
  var dist = `${global.serverCodeRootPath}/auto/config/index.js`
    var content = 
`${WARN_TIP}
module.exports = ${JSON.stringify({
  database: global.projectName, // 数据库名
  ...config
}, null, '  ')}
`
  fs.outputFileSync(dist, content)
}

function generatorRouter(modelList) {
  generatorRouterMain(modelList)
  generatorRouterMain(modelList, true)
}

function generatorRouterMain(modelList, isEjected) {
  var routerPath = `${global.serverCodeRootPath}/auto/${isEjected ? 'ejected-' : ''}router.js` // 这时候 serverCodeRootPath 一定有

  var mainContent = modelList.filter(model => {
                                if(isEjected) {
                                  return model.isEjected
                                } else {
                                  return !model.isEjected
                                }
                              })
                              .map(model => {
                                  var controllerPrefixPath = line2upper(`${!isEjected ? 'auto.' : ''}${model.type ? `${model.type}.` : ''}${model.name}`)
                                  var res =
`  router.get('/api/${model.name}/list', jwt, controller.${controllerPrefixPath}.list)${model.isPublic ? `\n  router.get(\`/\${publicPrefix}/${model.name}/list\`, controller.${controllerPrefixPath}.list)` : ''}
  router.get('/api/${model.name}/detail/:id', jwt, controller.${controllerPrefixPath}.detail)${model.isPublic ? `\n  router.get(\`/\${publicPrefix}/${model.name}/detail/:id\`, controller.${controllerPrefixPath}.detail)` : ''}
  router.post('/api/${model.name}/add', jwt, controller.${controllerPrefixPath}.add)${model.isPublic ? `\n  router.post(\`/\${publicPrefix}/${model.name}/add\`, controller.${controllerPrefixPath}.add)` : ''}
  router.post('/api/${model.name}/edit', jwt, controller.${controllerPrefixPath}.edit)${model.isPublic ? `\n  router.post(\`/\${publicPrefix}/${model.name}/edit\`, controller.${controllerPrefixPath}.edit)` : ''}
  router.post('/api/${model.name}/del/:id', jwt, controller.${controllerPrefixPath}.del)${model.isPublic ? `\n  router.post(\`/\${publicPrefix}/${model.name}/del/:id\`, controller.${controllerPrefixPath}.del)` : ''}`
                                  return res
                                }).join('\n\n')

  var content =
`${WARN_TIP}
module.exports = function (router, controller, jwt, publicPrefix) {
${mainContent}
}
`
  fs.outputFileSync(routerPath, content)
}



function generatorModelMap(modelList) {
  generatorModelMapMain(modelList)
  generatorModelMapMain(modelList, true)
}

function generatorModelMapMain(modelList, isEjected) {
  var modelMapPath = `${global.serverCodeRootPath}/auto/config/${isEjected ? 'ejected-' : ''}model-map.js`
  var mainContent = {}
  modelList.filter(model => {
    if(isEjected) {
      return model.isEjected
    } else {
      return !model.isEjected
    }
  }).forEach(model => {
    mainContent[model.name] = `${!isEjected ? 'auto/' : ''}${model.type ? `${model.type}/` : ''}model/${model.name}`
  })
  var content = 
`${WARN_TIP}
module.exports = ${JSON.stringify(mainContent, null, '  ')}
`
  fs.outputFileSync(modelMapPath, content)
}

function line2upper(str) {
  return str.replace( /[_|-]([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  })
}

