import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import * as cacheModel from "../models/cache.model";
import { cacheNode, cacheReducer } from "./cache.reducer";


export interface IState {
    [cacheNode]: cacheModel.ICache
}

export const reducers: ActionReducerMap<IState> = {
    [cacheNode]: cacheReducer
}

export const metaReducers: MetaReducer<IState>[] = !environment.production ? [] : []