import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import * as authorizationModel from "../models/authorization.model";
import { authorizationNode, authorizationReducer } from "./authorization.reducer";


export interface IState {
    [authorizationNode]: {
        user: authorizationModel.IUser,
        isReady: boolean
    }
}

export const reducers: ActionReducerMap<IState> = {
    [authorizationNode]: authorizationReducer
}

export const metaReducers: MetaReducer<IState>[] = !environment.production ? [] : []