import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import * as toastsModel from "../models/toasts.model";
import { toastsNode, toastsReducer } from "./toasts.reducer";


export interface IState {
    [toastsNode]: toastsModel.IToast[]
}

export const reducers: ActionReducerMap<IState> = {
    [toastsNode]: toastsReducer
}

export const metaReducers: MetaReducer<IState>[] = !environment.production ? [] : []