import * as announcementModel from "../../../pages/main/models/main.model";
import * as userModel from "../../user/models/user.model";

export interface ICache {
    announcementList: announcementModel.IAnnouncement[],
    userList: userModel.IUser[],
    announcementListReady: boolean,
    userListReady: boolean,
}

export enum cacheActionEnums {
    getAnnouncementCacheList = "[Cache Component] Get Announcement Cache List",
    getAnnouncementCacheListSuccess = "[Cache Component] Get Announcement Cache List Success",
    getAnnouncementCacheListError = "[Cache Component] Get Announcement Cache List Error",
    getAnnouncementCacheListAbolition = "[Cache Component] Get Announcement Cache List Abolition",
    
    getUserCacheList = "[Cache Component] Set User Cache List",
    getUserCacheListSuccess = "[Cache Component] Set User Cache List Success",
    getUserCacheListError = "[Cache Component] Set User Cache List Error",

    putAnnouncementCache = "[Cache Component] Put Announcement Cache",
    putAnnouncementCacheSuccess = "[Cache Component] Put Announcement Cache",
    putAnnouncementCacheError = "[Cache Component] Put Announcement Cache",

    putUserByIdCache = "[Cache Component] Put User By Id Cache",
    putUserByIdCacheSuccess = "[Cache Component] Put User By Id Cache Success",
    putUserByIdCacheError = "[Cache Component] Put User By Id Cache Error",

    removeAnnouncementCache = "[Cache Component] Remove Announcement Cache",
    removeUserCache = "[Cache Component] Remove User Cache",

    clearAnnouncementCache = "[Cache Component] Clear Announcement Cache",
    clearUserCache = "[Cache Component] Clear User Cache",
}