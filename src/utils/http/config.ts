import type { ErrorToastOption, HttpErrorInfo } from './types'

let globalErrorToast: ErrorToastOption = true
let unauthorizedHandler: ((error: HttpErrorInfo) => void) | null = null

export function setGlobalErrorToast(option: ErrorToastOption) {
  globalErrorToast = option
}

export function getGlobalErrorToast(): ErrorToastOption {
  return globalErrorToast
}

export function setUnauthorizedHandler(handler: (error: HttpErrorInfo) => void) {
  unauthorizedHandler = handler
}

export function getUnauthorizedHandler(): ((error: HttpErrorInfo) => void) | null {
  return unauthorizedHandler
}
