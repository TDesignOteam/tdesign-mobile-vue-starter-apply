// 这里导入的是全局的 axios 实例
// 请求 url(/api/tencent-map/...) 会直接通过 Vite 的代理规则
import axios from 'axios'

export async function getCityNameFromCoords(
  latitude: number,
  longitude: number,
): Promise<string> {
  const tencentApiKey = window.appConfig?.apiKey?.tencentMap
  if (!tencentApiKey) {
    throw new Error('腾讯地图 API Key 缺失，请检查配置文件 config.json')
  }
  const url = `/api/tencent-map/ws/geocoder/v1/?location=${latitude},${longitude}&key=${tencentApiKey}`

  try {
    const response = await axios
      .get(url, { timeout: 5000 })
    const data = response.data
    if (data.status !== 0) {
      throw new Error(`腾讯地图 API 返回错误: ${data.message}`)
    }
    const city = data.result.address_component.city
    return city || '未知城市'
  }
  catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      throw new Error('请求超时')
    }
    throw error
  }
}
