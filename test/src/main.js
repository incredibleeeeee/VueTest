import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import api from './http'
import ElementPlus from 'element-plus' // 注意ElementUI在Vue 3中已经更名为ElementPlus
import 'element-plus/dist/index.css' // 引入ElementPlus样式

const app = createApp(App)
app.config.globalProperties.$axios = axios // 用 app.config.globalProperties 来代替 Vue.prototype
app.use(ElementPlus)
app.use(router).mount('#app')
app.config.globalProperties.$api = api
