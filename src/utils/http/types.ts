export interface HttpErrorInfo {
  status?: number
  message: string
  code?: string
  data?: unknown
  config?: unknown
}

export type ErrorToastOption = boolean | ((error: HttpErrorInfo) => string | false)
