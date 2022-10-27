import { createReducer, on } from "@ngrx/store";
import * as toastsModel from "../models/toasts.model";
import * as toastActions from "./toasts.actions";

export const toastsNode = "toasts"

export const toastDuration = 6000 // toast animation duration in milliseconds

export const initialState: toastsModel.IToast[] = []

export const toastsReducer = createReducer(
    initialState,
    on(toastActions.notify, (state, { toasts }) => {
        if (state.length < 5) {
            return ([...state, ...toasts])
        }

        return ([...state])
    }),
    on(toastActions.updateNotify, (state, { ready }) => ([{
        text: state[0].text,
        type: state[0].type,
        ready
    }])),
    on(toastActions.removeNotify, (state) => (state.filter((_, index) => index !== 0)))
)