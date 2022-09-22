export interface IToast {
    text: string,
    type: toastType,
    ready?: boolean
}

export enum toastTypeEnums {
    success = "success",
    warning = "warning",
    error = "error",
    notify = "notify",
    loading = "loading",
}

export enum toastMessageEnums {
    loading = "Пожалуйста подождите..."
}

export type toastType =
    toastTypeEnums.success |
    toastTypeEnums.warning |
    toastTypeEnums.error |
    toastTypeEnums.notify |
    toastTypeEnums.loading

/* Actions */

export enum toastActionEnums {
    notify = "[Toasts Component] Notify",
    updateNotify = "[Toasts Component] Update Notify",
    removeNotify = "[Toasts Component] Remove Notify"
}