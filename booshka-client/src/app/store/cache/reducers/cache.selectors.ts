import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as announcementModel from "src/app/pages/main/models/main.model";
import * as userModel from "../../user/models/user.model";
import * as cacheModel from "../models/cache.model";
import { cacheNode } from "./cache.reducer";


export const selectCacheFeature = createFeatureSelector<cacheModel.ICache>(cacheNode)

export const selectCacheAnnouncementList = createSelector(
    selectCacheFeature,
    (state: cacheModel.ICache): announcementModel.IAnnouncement[] => state.announcementList
)

export const selectCacheUserList = createSelector(
    selectCacheFeature,
    (state: cacheModel.ICache): userModel.IUser[] => state.userList
)

export const selectCacheAnnouncementListReady = createSelector(
    selectCacheFeature,
    (state: cacheModel.ICache): boolean => state.announcementListReady
)

export const selectCacheUserListReady = createSelector(
    selectCacheFeature,
    (state: cacheModel.ICache): boolean => state.userListReady
)