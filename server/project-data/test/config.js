module.exports = {
  type: 'admin',// all：所有。 server: 服务器。 admin: 管理后台
  dist: {
    server: '/Users/jinweiqiang/front-end/test',
    admin: '/Users/jinweiqiang/front-end/test-admin',
  },
  serverLan: 'node',
  db: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    // 数据库名
    database: 'test',
  },
}