import { createAction, props } from "@ngrx/store";
import * as cacheModel from "../models/cache.model";
import * as authorizationModel from "../../pages/authorization/models/authorization.model";
import * as announcementModel from "../../pages/main/models/main.model";

export const setUserById = createAction(cacheModel.cacheActionEnums.setUserById, props<{ id: string }>())
export const setUserByIdSuccess = createAction(cacheModel.cacheActionEnums.setUserByIdSuccess, props<{ payload: { key: string, value: authorizationModel.IUser } }>())
export const setUserByIdError = createAction(cacheModel.cacheActionEnums.setUserByIdError)

export const setAnnouncementPage = createAction(cacheModel.cacheActionEnums.setAnnouncementPage, props<{ page: number }>())
export const setAnnouncementPageSuccess = createAction(cacheModel.cacheActionEnums.setAnnouncementPageSuccess, props<{ payload: { key: string, value: announcementModel.IAnnouncement[] } }>())
export const setAnnouncementPageError = createAction(cacheModel.cacheActionEnums.setAnnouncementPageError)