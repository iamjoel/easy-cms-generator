const config = require('./config')

const express = require('express')
const app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json())


// 获取 Mysql 连接
var mysql = require('mysql');
var pool = mysql.createPool(config.mysql)

app.get('/', (req, res) => res.send('It works!'))

// 跨域头设置
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

var listPageApi = require('./api/list-page')
var updatePageApi = require('./api/update-page')
// 所有的api
var apis = {
  dict: require('./api/dict'),
  role: require('./api/role'),
  entity: require('./api/entity'),
  listPage: listPageApi,
  updatePage: require('./api/update-page'),
}

generateAPI(Object.keys(apis))

var dashboard = require('./api/dashboard')
app.get('/config/detail', dashboard.detail)
app.post('/config/sync', (req, res)=> {
  dashboard.syncConfig(req, res, pool)
})

app.post('/list-page/expendCofigToFile/:id', (req, res)=> {
  listPageApi.expendCofigToFile(req, res, pool)
})

app.post('/list-page/updateFreeze/:id', (req, res)=> {
  listPageApi.updateFreeze(req, res, pool)
})

app.post('/update-page/expendCofigToFile/:id', (req, res)=> {
  updatePageApi.expendCofigToFile(req, res, pool)
})

app.post('/update-page/updateFreeze/:id', (req, res)=> {
  updatePageApi.updateFreeze(req, res, pool)
})



function generateAPI(names) {
  names.forEach(name => {
    // 列表
    app.get(`/${name}/list`, (req,res) => {
      apis[name].list(req, res, pool)
    })
    // 详情
    app.get(`/${name}/:id`, (req,res) => {
      apis[name].detail(req, res, pool)
    })
    // 新增
    app.put(`/${name}`, (req,res) => {
      apis[name].add(req, res, pool)
    })
    // 修改
    app.post(`/${name}/:id`, (req,res) => {
      apis[name].edit(req, res, pool)
    })
    // 删除
    app.delete(`/${name}/:id`, (req,res) => {
      apis[name].remove(req, res, pool)
    })
  })
}

app.listen(config.port, () => console.log(`app listening on port ${config.port}!`))