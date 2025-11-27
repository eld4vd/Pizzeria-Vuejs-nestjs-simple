declare module 'vue-toastification' {
  import { Plugin } from 'vue'
  
  export interface ToastOptions {
    position?: string
    timeout?: number | false
    closeOnClick?: boolean
    pauseOnFocusLoss?: boolean
    pauseOnHover?: boolean
    draggable?: boolean
    draggablePercent?: number
    showCloseButtonOnHover?: boolean
    hideProgressBar?: boolean
    closeButton?: string | boolean
    icon?: boolean | string
    rtl?: boolean
  }

  export interface ToastInterface {
    (message: string, options?: ToastOptions): void
    success(message: string, options?: ToastOptions): void
    error(message: string, options?: ToastOptions): void
    warning(message: string, options?: ToastOptions): void
    info(message: string, options?: ToastOptions): void
  }

  export function useToast(): ToastInterface

  const Toast: Plugin
  export default Toast
}
