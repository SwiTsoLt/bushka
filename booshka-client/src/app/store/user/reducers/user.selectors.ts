import { createFeatureSelector, createSelector } from "@ngrx/store";
import { appNode } from "src/app/models/app.models";
import * as userModel from "../models/user.model";
import { userNode } from "./user.reducer";


export interface IFeatureState {
    user: userModel.IUser,
    ready: boolean
}

export const selectUserFeature = createFeatureSelector<IFeatureState>(userNode)

export const selectUser = createSelector(
    selectUserFeature,
    (state: IFeatureState): userModel.IUser => state.user
)

export const selectUserReady = createSelector(
    selectUserFeature,
    (state: IFeatureState): boolean => state.ready
)