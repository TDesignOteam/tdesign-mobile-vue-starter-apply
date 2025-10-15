import { createApp } from 'vue'
import App from './App.vue'
import { loadAppConfig } from './config'
import router from './router'
import 'tdesign-mobile-vue/es/style/index.css'
import '@/styles/main.less'

async function enableMocking() {
  if (import.meta.env.PROD)
    return
  if (import.meta.env.VITE_APP_ENABLE_MOCKS === 'true') {
    const { worker } = await import('../mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

const app = createApp(App)
app.use(router)

enableMocking().then(async () => {
  await loadAppConfig(app)
  app.mount('#app')
})
