import axios from 'axios'
import {Message} from 'element-ui'

// 请求加token
var token = localStorage.getItem('j-token')
axios.interceptors.request.use(config => {
  return new Promise((resolve, reject)=>{
    if(config.url.indexOf('project/choose') === -1) {
      config.params = config.params || {}
      config.headers['token'] = token;
    }
    return resolve(config);
  })
}, function (error) {
  return Promise.reject(error);
})

axios.interceptors.response.use(function (response) {
  var data = response.data
  var config = response.config
  var errorCode = data.errCode
  if(errorCode !== 0) {
    Message({
      message: data.error || '未知错误',
      type: 'error'
    })
    
    return Promise.reject()
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

