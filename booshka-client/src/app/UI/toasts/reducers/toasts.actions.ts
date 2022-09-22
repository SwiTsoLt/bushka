import { createAction, props } from "@ngrx/store";
import * as toastsModel from "../models/toasts.model";


export const notify = createAction(toastsModel.toastActionEnums.notify, props<{ toasts: toastsModel.IToast[] }>())
export const updateNotify = createAction(toastsModel.toastActionEnums.updateNotify, props<{ ready: boolean }>())
export const removeNotify = createAction(toastsModel.toastActionEnums.removeNotify)