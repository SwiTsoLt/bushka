import { createAction, props } from "@ngrx/store";
import * as toastsModel from "../models/toasts.model";


export const notify = createAction(toastsModel.toastActionEnums.notify, props<{ toasts: toastsModel.IToast[] }>())
export const removeNotify = createAction(toastsModel.toastActionEnums.removeNotify)