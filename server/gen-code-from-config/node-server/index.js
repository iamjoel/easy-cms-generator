var fs = require('fs-extra')
var routerTemplate = require('./template/router')

function gen (dist, tableList) {
  // 路由
  // genRouter (`${dist}/app/router.js`, tableList)

  // model path map
  var modelMapList = genModelPathMap (`${dist}/config/model-map.js`, tableList)

  // model

  // service
  // genService(`${dist}/app/service.js`, modelMapList)

  // controller
  // genController(`${dist}/app/controller.js`, modelMapList)

}

function genRouter(dist, tableList) {
  var mainContent = tableList.map(table => {
    var {type, name} = table.basic
    var controllerPrefixPath = line2upper(`${type ? `${type}.` : ''}${name}`)
    var res =
`  router.get('/api/${name}/list', jwt, controller.${controllerPrefixPath}.list)${table.isPublic ? `\n  router.get(\`/\${publicPrefix}/${name}/list\`, controller.${controllerPrefixPath}.list)` : ''}
  router.get('/api/${name}/detail/:id', jwt, controller.${controllerPrefixPath}.detail)${table.isPublic ? `\n  router.get(\`/\${publicPrefix}/${name}/detail/:id\`, controller.${controllerPrefixPath}.detail)` : ''}
  router.post('/api/${name}/add', jwt, controller.${controllerPrefixPath}.add)${table.isPublic ? `\n  router.post(\`/\${publicPrefix}/${name}/add\`, controller.${controllerPrefixPath}.add)` : ''}
  router.post('/api/${name}/edit', jwt, controller.${controllerPrefixPath}.edit)${table.isPublic ? `\n  router.post(\`/\${publicPrefix}/${name}/edit\`, controller.${controllerPrefixPath}.edit)` : ''}
  router.post('/api/${name}/del/:id', jwt, controller.${controllerPrefixPath}.del)${table.isPublic ? `\n  router.post(\`/\${publicPrefix}/${name}/del/:id\`, controller.${controllerPrefixPath}.del)` : ''}`
                                  return res
                                }).join('\n\n')

  fs.outputFileSync(dist, routerTemplate.replace('{genRouter}', mainContent))
  console.log(`生成路由到 ${outputPath} 成功!`)
}

function line2upper(str) {
  return str.replace( /[_|-]([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  })
}

function genModelPathMap (dist, tableList) {
  var modelMapList = []
  var modelMapObj = {}
  tableList.forEach(table => {
    var {type, name} = table.basic
    modelMapObj[name] = `${type ? `${type}/` : ''}model/${name}`

    modelMapList.push({
      type,
      name
    })
  })
  var res = 
`module.exports = ${JSON.stringify(modelMapObj, null, '  ')}`
  fs.outputFileSync(dist, res)
  console.log(`生成 ModelMap 至: ${dist}  成功!`)
  return modelMapList
}

function genService (dist, modelMapList) {
  // modelMapList.forEach()
  const {modelName, modelPrefix} = info

  let dist = line2upper(`app/service/${modelPrefix.join('/')}/${modelName.join('/')}.js`)
  var template = require('./template/service.js')

  fs.outputFileSync(dist, template)
  console.log(`输出 Service 至: ${dist}  成功!`)

}

function genController (info) {
  const {modelName, modelPrefix, modelSuffix} = info
  var modelPrefixPath = modelPrefix.join('/')
  var servicePath = line2upper(`${modelPrefix.join('.')}.${modelSuffix.join('.')}`)

  let dist = `app/controller/${modelPrefix.join('/')}/${modelSuffix.join('/')}.js`
  var template = require('./template/controller.js')
  template = template.replace(/{servicePath}/g, servicePath)

  fs.outputFileSync(dist, template)
  console.log(`输出 Controller 至: ${dist}  成功!`)
}

function line2upper(str) {
  return str.replace( /[_|-]([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  })
}

module.exports = gen