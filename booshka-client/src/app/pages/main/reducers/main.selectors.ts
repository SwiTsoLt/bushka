import { createFeatureSelector, createSelector } from "@ngrx/store"
import * as announcementModel from "../models/main.model"
import { announcementNode } from "./main.reducer"

export const selectAnnouncementListFeature = createFeatureSelector<{
    announcementList: announcementModel.IAnnouncement[],
    isReady: boolean
}>(announcementNode)

export const selectAnnouncementList = createSelector(
    selectAnnouncementListFeature,
    (state: {
        announcementList: announcementModel.IAnnouncement[],
        isReady: boolean
    }): announcementModel.IAnnouncement[] => state.announcementList
)

export const selectAnnouncementIsReady = createSelector(
    selectAnnouncementListFeature,
    (state: {
        announcementList: announcementModel.IAnnouncement[],
        isReady: boolean
    }): boolean => state.isReady
)