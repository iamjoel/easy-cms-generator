var fs = require('fs-extra')
var routerTemplate = require('./template/router')

function  gen(dist, tableList) {
  // 路由
  genRouter(dist, tableList)

  // model path map

  // service

  // controller
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
  
  console.log(mainContent)

}

function line2upper(str) {
  return str.replace( /[_|-]([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  })
}

module.exports = gen