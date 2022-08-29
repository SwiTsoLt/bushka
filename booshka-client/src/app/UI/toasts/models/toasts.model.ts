export interface IToast {
    text: string,
    type: toastType
}

export enum toastTypeEnums {
    success = "success",
    warning = "warning",
    error = "error",
    notify = "notify"
}

export type toastType =
    "success" |
    "warning" |
    "error"   |
    "notify"

/* Actions */

export enum toastActionEnums {
    notify = "[Toasts Component] Notify",
    removeNotify = "[Toasts Component] Remove Notify"
}