import Vue from 'vue'
import App from './App'
// 导入封装的插件
import request from "@/utils/request"

Vue.config.productionTip = false

App.mpType = 'app'
// 使用插件,并传入一些参数 : Vue与基准地址
Vue.use(request(Vue,{
  baseURL:"https://www.uinav.com"
}))

const app = new Vue({
  ...App
})
app.$mount()
