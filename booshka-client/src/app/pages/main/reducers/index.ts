import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import * as announcementModel from "../models/main.model"
import { announcementNode, announcementReducer } from "./main.reducer";


export interface IState {
    [announcementNode]: {
        announcementList: announcementModel.IAnnouncement[],
        isReady: boolean
    }
}

export const reducers: ActionReducerMap<IState> = {
    [announcementNode]: announcementReducer
}

export const metaReducers: MetaReducer<IState>[] = !environment.production ? [] : []