import type { App } from 'vue'
import axios from 'axios'

export interface AppConfig {
  apiKey: {
    tencentMap: string
    // 其他 API Key...
  }
  app: {
    name: string
    version: string
  }
  // 其他配置项...
}

declare global {
  interface Window {
    appConfig: AppConfig
  }
}

/**
 * 从 public/config.json 文件加载全局配置
 *
 * @param app Vue 应用实例
 * @returns 加载的配置对象
 */
export async function loadAppConfig(app: App): Promise<AppConfig> {
  try {
    const response = await axios.get<AppConfig>('/config.json')
    const config = response.data

    window.appConfig = config
    // 可选：将配置注入到 Vue 实例中，方便在组件内访问
    app.config.globalProperties.$config = config
    return config
  }
  catch (error) {
    console.error('Failed to load app config:', error)
    // 根据需要处理错误，例如显示一个错误页面或使用默认配置
    throw new Error('获取全局配置失败，请检查 public 目录下是否存在 config.json')
  }
}
