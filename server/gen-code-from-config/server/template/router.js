const publicPrefix = 'publicApi';

module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt();
  
  router.post('/api/picture/upload', controller.common.upload.uploadImg); // 图片上传
  router.post('/api/file/upload', controller.common.upload.uploadFile); // 文件上传
  router.post('/api/login', controller.common.login.login);

  router.get('/api/login_log/list', jwt, controller.log.loginLog.list)
  router.get('/api/login_log/detail/:id', jwt, controller.log.loginLog.detail)

  router.get('/api/op_log/list', jwt, controller.log.opLog.list)
  router.get('/api/op_log/detail/:id', jwt, controller.log.opLog.detail)

  router.get('/api/api_log/list', jwt, controller.log.apiLog.list)
  router.get('/api/api_log/detail/:id', jwt, controller.log.apiLog.detail)


};
