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

// 所有的api
var apis = {
  dict: require('./api/dict'),
  role: require('./api/role'),
  entity: require('./api/entity'),
  listPage: require('./api/list-page'),
}

generateAPI(Object.keys(apis))

function generateAPI(names) {
  names.forEach(name => {
    console.log(`generated ${name}`)
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