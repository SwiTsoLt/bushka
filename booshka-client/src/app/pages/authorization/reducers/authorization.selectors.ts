import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as authorizationModel from "../models/authorization.model";
import { authorizationNode } from "./authorization.reducer";


export const selectAuthorizationFeature = createFeatureSelector<{
    user: authorizationModel.IUser,
    isReady: boolean
}>(authorizationNode)

export const selectUser = createSelector(
    selectAuthorizationFeature,
    (state: {
        user: authorizationModel.IUser,
        isReady: boolean
    }): authorizationModel.IUser => state.user
)

export const selectUserIsAuth = createSelector(
    selectAuthorizationFeature,
    (state: {
        user: authorizationModel.IUser,
        isReady: boolean
    }): boolean => !!state.user.gmail.trim().length
)

export const selectUserIsReady = createSelector(
    selectAuthorizationFeature,
    (state: {
        user: authorizationModel.IUser,
        isReady: boolean
    }): boolean => state.isReady
)