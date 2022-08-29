import { createAction, props } from "@ngrx/store";
import * as announcementModel from "../models/main.model";


export const setAnnouncementList = createAction(announcementModel.announcementActionsEnum.setAnnouncementList)
export const setAnnouncementListSuccess = createAction(
    announcementModel.announcementActionsEnum.setAnnouncementListSuccess,
    props<{ payload: announcementModel.IAnnouncement[] }>()
)
export const setAnnouncementListError = createAction(announcementModel.announcementActionsEnum.setAnnouncementListError)