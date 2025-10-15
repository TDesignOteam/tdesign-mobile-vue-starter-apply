import { Toast } from 'tdesign-mobile-vue'

let errorNotifier: (message: string) => void = (message: string) => {
  Toast?.({ message })
}

export function setErrorNotifier(notifier: (message: string) => void) {
  errorNotifier = notifier
}

export function notifyError(message: string) {
  errorNotifier(message)
}
