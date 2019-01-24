// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'

import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

import deepClone from 'clone'
import {SERVER_PREFIX} from '@/setting'
import {Message} from 'element-ui'

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

Vue.prototype.$isColValid = (cols) => {
  var errMsg

  cols.forEach((col, index) => {
    if(errMsg) {
      return
    }
    if(!col.key) {
      errMsg = `第${index + 1}条, 请输入名称`
    } else if(/-/.test(col.key)) {
      errMsg = `第${index + 1}条, 名称中不能带中划线`
    } else if(!col.label) {
      errMsg = `第${index  + 1}条, 请输入中文名`
    } else if(/-/.test(col.label)) {
      errMsg = `第${index + 1}条, 中文名中不能带中划线`
    } else if(!col.label) {
      errMsg = `第${index  + 1}条, 请选择数据类型`
    }
  })

  if(errMsg) {
    Message({
      showClose: true,
      message: errMsg,
      type: 'error'
    })
    return false
  }
  return true
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
