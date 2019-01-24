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
  if(req.path.indexOf('project/choose') !== -1 || global.projectName) {
    next()
  } else {
    let isTest = true
    if(isTest) {
      let name = 'generator-demo'
      let rootPath = '/Users/jinweiqiang/front-end/generator-demo'
      const FileSync = require('lowdb/adapters/FileSync')
      const adapter = new FileSync(`data/${name}.json`)
      const low = require('lowdb')
      const db = low(adapter)
      // 不要设置db.defaults。设置 default 导致 db.json 被间歇性的reload。导致开发时，服务器不断重启。。。
      global.db = db
      global.projectName = name
      global.feCodeRootPath = `${rootPath}/admin`
      global.serverCodeRootPath = `${rootPath}/server`
      next()
    } else {
      res.send(apiFormat.error('未设置项目', 2))
    }
    
  }
})

// 所有的api
var apis = {
  dict: require('./api/utils/commonCRUD')('dict'),
  role: require('./api/utils/commonCRUD')('role'),
  entityType: require('./api/utils/commonCRUD')('entityType'),
  router: require('./api/utils/commonCRUD')('router'),
  menu: require('./api/utils/commonCRUD')('menu'),
}

generateAPI(Object.keys(apis).map(name => name))

var projectApi = require('./api/project')
app.get('/project/check-folds-exist', projectApi.checkFoldsExist)

app.post('/project/create-folder', (req, res)=> {
  projectApi.createFile(req, res)
})

app.post('/project/choose', (req, res)=> {
  projectApi.choose(req, res)
})

var entityApi = require('./api/entity')
app.get(`/entity/list`, (req,res) => {
  entityApi.list(req, res)
})

app.get(`/entity/:id`, (req,res) => {
  entityApi.detail(req, res)
})

app.put(`/entity`, (req,res) => {
  entityApi.add(req, res)
})

app.post(`/entity/:id`, (req,res) => {
  entityApi.edit(req, res)
})

app.post(`/entity-eject/:id`, (req,res) => {
  entityApi.eject(req, res)
})

app.delete(`/entity/:id`, (req,res) => {
  entityApi.remove(req, res)
})

app.get(`/entity-common-cols/list`, (req,res) => {
  entityApi.commonCols(req, res)
})

var listPageApi = require('./api/list-page')
app.get(`/listPage/list`, (req,res) => {
  listPageApi.list(req, res)
})

app.get(`/listPage/:id`, (req,res) => {
  listPageApi.detail(req, res)
})

app.put(`/listPage`, (req,res) => {
  listPageApi.add(req, res)
})

app.post(`/listPage/:id`, (req,res) => {
  listPageApi.edit(req, res)
})

app.post(`/listPage-eject/:id`, (req,res) => {
  listPageApi.eject(req, res)
})

app.delete(`/listPage/:id`, (req,res) => {
  listPageApi.remove(req, res)
})

var updatePageApi = require('./api/update-page')
app.get(`/updatePage/list`, (req,res) => {
  updatePageApi.list(req, res)
})

app.get(`/updatePage/:id`, (req,res) => {
  updatePageApi.detail(req, res)
})

app.put(`/updatePage`, (req,res) => {
  updatePageApi.add(req, res)
})

app.post(`/updatePage/:id`, (req,res) => {
  updatePageApi.edit(req, res)
})

app.post(`/updatePage-eject/:id`, (req,res) => {
  updatePageApi.eject(req, res)
})

app.delete(`/updatePage/:id`, (req,res) => {
  updatePageApi.remove(req, res)
})

var configApi = require('./api/config')
app.post('/config/sync-to-project', (req, res)=> {
  configApi.syncToProject(req, res)
})

app.get('/config/db-schema', (req, res)=> {
  configApi.generatorDBSchema(req, res)
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