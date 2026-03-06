import { ToastService, toastStore, toastState } from "./toastService.js"

export const toasts = toastStore
export const toastsState = toastState
export { Toast } from "./toastService.js"
export default new ToastService()