const config = require('./config')

const express = require('express')
const app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json())

const apiFormat = require('./utils/apiFormat')

app.get('/', (req, res) => res.send('It works!'))

// 跨域头设置
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

// 有没设置的检查
app.use(function(req, res, next) {
  console.log(req.path)
  if(req.path.indexOf('project/choose') !== -1 || global.projectName) {
    next()
  } else {
    res.send(apiFormat.error('未设置项目', 2))
  }
})

// 所有的api
var apis = {
  dict: require('./api/utils/commonCRUD')('dict'),
  role: require('./api/utils/commonCRUD')('role'),
  entityType: require('./api/utils/commonCRUD')('entityType'),
  entity: require('./api/utils/commonCRUD')('entity'),
  router: require('./api/utils/commonCRUD')('router'),
  listPage: require('./api/utils/commonCRUD')('listPage'),
  updatePage: require('./api/utils/commonCRUD')('updatePage'),
  menu: require('./api/utils/commonCRUD')('menu'),
}

generateAPI(Object.keys(apis).map(name => {
  if(name === 'entity') {
    return {
      name: 'entity',
      config: {list: true, detail: true, remove: true}
    }
  } else {
    return name
  }
}))

var projectApi = require('./api/project')
app.get('/project/check-folds-exist', projectApi.checkFoldsExist)

app.post('/project/create-folder', (req, res)=> {
  projectApi.createFile(req, res)
})

app.post('/project/choose', (req, res)=> {
  projectApi.choose(req, res)
})

var configApi = require('./api/config')
app.post('/config/sync/:type', (req, res)=> {
  configApi.syncConfig(req, res)
})

var entityApi = require('./api/entity')
app.put(`/entity`, (req,res) => {
  entityApi.add(req, res)
})

app.post(`/entity/:id`, (req,res) => {
  entityApi.edit(req, res)
})

var listPageApi = require('./api/list-page')
app.post('/list-page/expendCofigToFile/:id', (req, res)=> {
  listPageApi.expendCofigToFile(req, res)
})

app.post('/list-page/updateFreeze/:id', (req, res)=> {
  listPageApi.updateFreeze(req, res)
})

var updatePageApi = require('./api/update-page')
app.post('/update-page/expendCofigToFile/:id', (req, res)=> {
  updatePageApi.expendCofigToFile(req, res)
})

app.post('/update-page/updateFreeze/:id', (req, res)=> {
  updatePageApi.updateFreeze(req, res)
})

app.get('/sync-status', (req, res)=> {
  var results = global.db
                      .get('syncStatus')
                      .value()
  res.send(apiFormat.success(results))
})



function generateAPI(names) {
  names.forEach(name => {
    var config
    if(typeof name === 'object') {
      config = name.config
      name = name.name
    }
    if(!config || config.list) {
      // 列表
      app.get(`/${name}/list`, (req,res) => {
        apis[name].list(req, res)
      })
    }
    
    if(!config || config.detail) {
      // 详情
      app.get(`/${name}/:id`, (req,res) => {
        apis[name].detail(req, res)
      })
    }

    if(!config || config.add) {
      // 新增
      app.put(`/${name}`, (req,res) => {
        apis[name].add(req, res)
      })
    }

    if(!config || config.edit) {
      // 修改
      app.post(`/${name}/:id`, (req,res) => {
        apis[name].edit(req, res)
      })
    }

    if(!config || config.remove) {
      // 删除
      app.delete(`/${name}/:id`, (req,res) => {
        apis[name].remove(req, res)
      })
    }

  })
}

app.listen(config.port, () => console.log(`app listening on port ${config.port}!`))