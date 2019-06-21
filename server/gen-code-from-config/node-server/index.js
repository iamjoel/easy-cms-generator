var fs = require('fs-extra')
var routerTemplate = require('./template/router')

function gen (currProject, dist, tableList, commonCols) {
  // 数据库配置文件
  genDBConfig(currProject, `${dist}/config`)

  // 路由
  genRouter (`${dist}/app/router.js`, tableList)

  // model path map
  var modelMapList = genModelPathMap (`${dist}/config/model-map.js`, tableList)

  // model
  genModel(`${dist}/app/service`, modelMapList, tableList, commonCols)

  // service
  genService(`${dist}/app/service`, modelMapList)

  // controller
  genController(`${dist}/app/controller`, modelMapList)

  console.log('服务器代码生成完成!\n')

}

function genDBConfig(currProject, dist) {
  const {db: dbConfig} = require(`../../project-data/${currProject}/config`)
  var res = 
`module.exports = ${JSON.stringify(dbConfig, null, '  ')}`

fs.outputFileSync(`${dist}/mysql.local.js`, res)
fs.outputFileSync(`${dist}/mysql.prod.js`, res)

console.log('01: 数据库配置文件生成完成!\n')

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
  console.log(`02: 生成路由到 ${outputPath} 成功!\n`)
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
  console.log(`03: 生成 ModelMap 至: ${dist}  成功!\n`)
  return modelMapList
}

function genModel (dist, modelMapList, tableList, commonCols) {
  modelMapList.forEach((info, index) => {
    var table = tableList[index]
    var basic = table.basic
    var cols = table.cols || []
    cols = [...commonCols, ...cols]

    var model = {
      viewFields: cols.map(col => col.key),
      validFields: cols.map(col => {
        var rule = { // https://github.com/node-modules/parameter
          required: !!col.required, // col.required 设置 undefined => true
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

    const res = 
`module.exports = ${JSON.stringify(model, null, '  ')}`

    const {type, name} = info
    let fileDist = `${dist}/${type ? `${type}/` : ''}model/${name}.js`
    fs.outputFileSync(fileDist, res)
    console.log(`输出 Model 至: ${fileDist}  成功!`)
  })
  console.log(`04: 生成 Model 完成!\n`)
}

function genService (dist, modelMapList) {
  var template = require('./template/service.js')

  modelMapList.forEach(info => {
    const {type, name} = info
    let fileDist = `${dist}/${type ? `${type}/` : ''}${name}.js`
    fs.outputFileSync(fileDist, template)
    console.log(`生成 Service 至: ${fileDist}  成功!`)
  })
  console.log(`05: 生成 Service 完成!\n`)
}

function genController (dist, modelMapList) {
  var template = require('./template/controller.js')

  modelMapList.forEach(info => {
    const {type, name} = info
    var servicePath = line2upper(`${type ? `${type}.` : ''}${name}`)
    var res = template.replace(/{servicePath}/g, servicePath)
    let fileDist = `${dist}/${type ? `${type}/` : ''}${name}.js`
    fs.outputFileSync(fileDist, res)
    console.log(`输出 Controller 至: ${fileDist}  成功!`)
  })
  console.log(`06: 生成 Controller 完成!\n`)
}

function line2upper(str) {
  return str.replace( /[_|-]([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  })
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

module.exports = gen