import * as authorizationModel from "../../pages/authorization/models/authorization.model"
import * as announcementModel from "../../pages/main/models/main.model"

export interface ICache {
    userList: authorizationModel.IUser[],
    announcementList: announcementModel.IAnnouncement[],
}

export enum cacheActionEnums {
    setUserById = "[Authorization Component] Set User By Id",
    setUserByIdSuccess = "[Authorization Component] Set User By Id Success",
    setUserByIdError = "[Authorization Component] Set User By Id Error",

    setAnnouncementPage = "[Main Component] Set Announcement Page",
    setAnnouncementPageSuccess = "[Main Component] Set Announcement Page Success",
    setAnnouncementPageError = "[Main Component] Set Announcement Page Error"
}

export enum reducerKeyEnums {
    userList = "userList",
    announcementList = "announcementList",
}
