// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(iView)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 403:
          // 返回 401 清除token信息并跳转到登录页面
          self.deployTimeOutId = setTimeout(() => {
            router.replace({
              path: '/admin'
            })
          }, 1000)
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
