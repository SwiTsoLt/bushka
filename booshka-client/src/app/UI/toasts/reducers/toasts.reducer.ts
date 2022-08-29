import { createReducer, on } from "@ngrx/store";
import * as toastsModel from "../models/toasts.model";
import * as toastActions from "./toasts.actions";

export const toastsNode = "toasts"

export const toastDuration = 6000 // toast animation duration in milliseconds

export const initialState: toastsModel.IToast[] = []

export const toastsReducer = createReducer(
    initialState,
    on(toastActions.notify, (state, { toasts }) => ([...state, ...toasts])),
    on(toastActions.removeNotify, (state) => (state.filter((_, index) => index !== 0)))
)