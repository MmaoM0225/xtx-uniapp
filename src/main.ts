import { createSSRApp } from 'vue'
import pinia from './stores'
// 引入请求拦截器
import './utils/request'

import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)

  app.use(pinia)
  return {
    app,
  }
}
