import axios from 'axios'
// localStorage.setItem('sc-sessionid', Math.random()) // 测试
import {Message} from 'element-ui'

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

