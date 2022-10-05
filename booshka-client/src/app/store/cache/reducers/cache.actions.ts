import { createAction, props } from "@ngrx/store";
import * as announcementModel from "../../../pages/main/models/main.model";
import * as userModel from "../../user/models/user.model";
import * as cacheModel from "../models/cache.model";

export const getAnnouncementCacheList = createAction(cacheModel.cacheActionEnums.getAnnouncementCacheList)
export const getAnnouncementCacheListSuccess = createAction(cacheModel.cacheActionEnums.getAnnouncementCacheListSuccess, props<{ announcementList: announcementModel.IAnnouncement[] }>())
export const getAnnouncementCacheListError = createAction(cacheModel.cacheActionEnums.getAnnouncementCacheListError)
export const getAnnouncementCacheListAbolition = createAction(cacheModel.cacheActionEnums.getAnnouncementCacheListAbolition)

export const getUserCacheList = createAction(cacheModel.cacheActionEnums.getUserCacheList)
export const getUserCacheListSuccess = createAction(cacheModel.cacheActionEnums.getUserCacheListSuccess)
export const getUserCacheListError = createAction(cacheModel.cacheActionEnums.getUserCacheListError)

export const putAnnouncementCache = createAction(cacheModel.cacheActionEnums.putAnnouncementCache, props<{ announcement: announcementModel.IAnnouncement }>())
export const putAnnouncementCacheSuccess = createAction(cacheModel.cacheActionEnums.putAnnouncementCache, props<{ announcement: announcementModel.IAnnouncement }>())
export const putAnnouncementCacheError = createAction(cacheModel.cacheActionEnums.putAnnouncementCache, props<{ announcement: announcementModel.IAnnouncement }>())

export const putUserByIdCache = createAction(cacheModel.cacheActionEnums.putUserByIdCache, props<{ id: string }>())
export const putUserByIdCacheSuccess = createAction(cacheModel.cacheActionEnums.putUserByIdCacheSuccess, props<{ user: userModel.IUser }>())
export const putUserByIdCacheError = createAction(cacheModel.cacheActionEnums.putUserByIdCacheError)

export const removeAnnouncementCache = createAction(cacheModel.cacheActionEnums.removeAnnouncementCache, props<{ id: string }>())
export const removeUserCache = createAction(cacheModel.cacheActionEnums.removeUserCache, props<{ id: string}>())

export const clearAnnouncementCache = createAction(cacheModel.cacheActionEnums.clearAnnouncementCache)
export const clearUserCache = createAction(cacheModel.cacheActionEnums.clearUserCache)