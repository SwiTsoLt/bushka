import { createReducer, on } from "@ngrx/store"
import * as cacheActions from "./cache.actions"
import * as cacheModel from "../models/cache.model"

export const cacheNode = "cache"

export const initialState: cacheModel.ICache = {
    [cacheModel.reducerKeyEnums.userList]: [],
    [cacheModel.reducerKeyEnums.announcementList]: []
}

export const cacheReducer = createReducer(
    initialState,
    on(cacheActions.setUserById, (state, { id }) => state),
    on(cacheActions.setUserByIdSuccess, (state, { payload }) => ({ ...state,  [payload?.key]: [...state.userList, payload?.value]})),
    on(cacheActions.setUserByIdError, (state) => state),

    on(cacheActions.setAnnouncementPage, (state, { page }) => state),
    on(cacheActions.setAnnouncementPageSuccess, (state, { payload }) => ({ ...state, [payload?.key]: [...state.announcementList, ...payload?.value] })),
    on(cacheActions.setAnnouncementPageError, (state) => state)
)