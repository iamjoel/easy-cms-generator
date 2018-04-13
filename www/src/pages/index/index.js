// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'
import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
import deepClone from 'clone'
import {SERVER_PREFIX} from '@/setting'
import {Message} from 'element-ui'


Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.toArray = (data) => {
  var value = deepClone(data)
  if(typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch (e) {
      value = []
    }
  }
  return value
}

Vue.prototype.syncConfig = () => {
  axios.post(`${SERVER_PREFIX}/config/sync`).then(({data}) => {
    Message({
      showClose: true,
      message: '同步成功',
      type: 'success'
    })
  })
};

import axios from 'axios'
require('@/service/interceptor') // axios 拦截器，做通用报错等
Vue.prototype.$http = axios

import store from '@/store'

// 过滤器
require('@/filters')

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
