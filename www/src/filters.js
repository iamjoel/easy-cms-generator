import Vue from 'vue'

import moment from 'moment'
Vue.filter('time', function (value, format="YYYY-MM-DD") {
  return moment(value).format(format)
})

Vue.filter('money', function (value) {
  if(value === null) {
    return 0
  }
  var res = value / 100
  return isNaN(res) ? '非法金额' : res
})