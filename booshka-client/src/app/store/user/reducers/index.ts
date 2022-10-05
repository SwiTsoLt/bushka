import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import * as userModel from "../models/user.model";
import { userNode, userReducer } from "./user.reducer";


export interface IState {
    [userNode]: {
        user: userModel.IUser,
        ready: boolean
    }
}

export const reducers: ActionReducerMap<IState> = {
    [userNode]: userReducer
}

export const metaReducers: MetaReducer<IState>[] = !environment.production ? [] : []