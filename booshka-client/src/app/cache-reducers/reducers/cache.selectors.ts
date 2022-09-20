import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as cacheModel from "../models/cache.model";
import * as authorizationModel from "../../pages/authorization/models/authorization.model";
import * as announcementModel from "../../pages/main/models/main.model";
import { cacheNode } from "./cache.reducer";


export const selectCacheFeature = createFeatureSelector<cacheModel.ICache>(cacheNode)

export const selectCacheUserList = createSelector(
    selectCacheFeature,
    (state: cacheModel.ICache): authorizationModel.IUser[] => state.userList
)

export const selectCacheAnnouncementList = createSelector(
    selectCacheFeature,
    (state: cacheModel.ICache): announcementModel.IAnnouncement[]  => state.announcementList
)