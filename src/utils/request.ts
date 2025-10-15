import type { ErrorToastOption, HttpErrorInfo } from '@/utils/http'
import axios from 'axios'
import { getGlobalErrorToast, getUnauthorizedHandler, mapStatusToMessage, notifyError, setErrorNotifier, setGlobalErrorToast, setToastDedupInterval, setUnauthorizedHandler, shouldSkipMessage } from '@/utils/http'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // 默认超时 3s
  timeout: 3000,
})

function resolveToastMessage(option: ErrorToastOption, error: HttpErrorInfo): string | false {
  if (typeof option === 'function')
    return option(error)
  return option ? error.message : false
}

function maybeToast(errorInfo: HttpErrorInfo, rawError: any) {
  // 请求被取消不提示
  if (axios.isCancel?.(rawError))
    return
  // 单请求优先，再回退全局
  const perRequestOption: ErrorToastOption | undefined = rawError?.config?.errorToast
  const finalOption: ErrorToastOption = perRequestOption ?? getGlobalErrorToast()
  const message = resolveToastMessage(finalOption, errorInfo)
  if (!message)
    return
  if (shouldSkipMessage(message))
    return
  notifyError(message)
}

instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 错误统一处理
    const httpError: HttpErrorInfo = {
      message: '请求出错',
      code: error?.code,
      status: error?.response?.status,
      data: error?.response?.data,
      config: error?.config,
    }

    // 请求被取消
    if (axios.isCancel?.(error)) {
      httpError.message = '请求已取消'
      return Promise.reject(httpError)
    }

    // 无响应
    if (!error?.response) {
      httpError.message = '请求失败'
      maybeToast(httpError, error)
      return Promise.reject(httpError)
    }

    // 有响应
    const status = error.response.status
    switch (status) {
      case 401:
        httpError.message = mapStatusToMessage(status)
        // 外部注入的 401 处理
        try {
          getUnauthorizedHandler()?.(httpError)
        }
        catch {}
        break
      default:
        httpError.message = mapStatusToMessage(status)
        break
    }
    maybeToast(httpError, error)
    return Promise.reject(httpError)
  },
)

export { setErrorNotifier, setGlobalErrorToast, setToastDedupInterval, setUnauthorizedHandler }
export type { HttpErrorInfo }

export default instance
