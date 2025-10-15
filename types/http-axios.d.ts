import type { ErrorToastOption } from '@/utils/http/types'
import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    errorToast?: ErrorToastOption
  }
}
