import { createReducer, on } from "@ngrx/store"
import * as announcementModel from "../models/main.model"
import * as announcementActions from "./main.actions"

export const announcementNode = "announcement"

export const initialState: {
    announcementList: announcementModel.IAnnouncement[],
    isReady: boolean
} = {
    announcementList: [],
    isReady: false
}

export const announcementReducer = createReducer(
    initialState,
    on(announcementActions.setAnnouncementList, (state) => state),
    on(announcementActions.setAnnouncementListSuccess, (state, { payload }) => ({ announcementList: payload, isReady: true })),
    on(announcementActions.setAnnouncementListError, (state) => ({ ...state, isReady: true }))
)