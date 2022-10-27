import { createReducer, on } from "@ngrx/store"
import * as cacheModel from "../models/cache.model"
import * as userModel from "../../user/models/user.model"
import * as cacheActions from "./cache.actions"


export const cacheNode = "cache"

export const initialState: cacheModel.ICache = {
    announcementList: [],
    userList: [],
    announcementListReady: true,
    userListReady: true
}

export const cacheReducer = createReducer(
    initialState,
    on(cacheActions.getAnnouncementCacheList, (state) => ({ ...state, announcementListReady: false })),
    on(cacheActions.getAnnouncementCacheListSuccess, (state) => ({...state, announcementListReady: true})),
    on(cacheActions.getAnnouncementCacheListError, (state) => ({ ...state, announcementListReady: true })),
    on(cacheActions.getAnnouncementCacheListAbolition, (state) => ({ ...state, announcementListReady: true })),

    on(cacheActions.getUserCacheList, (state) => ({ ...state, userListReady: false })),
    on(cacheActions.getUserCacheListSuccess, (state) =>({...state, userListReady: true})),
    on(cacheActions.getUserCacheListError, (state) => ({ ...state, userListReady: true })),

    on(cacheActions.putAnnouncementCache, (state, { announcement }) => ({ ...state, announcementList: [ announcement, ...state.announcementList ] })),
    
    on(cacheActions.putAnnouncementByIdCache, (state, { id }) => ({ ...state, announcementListReady: false })),
    on(cacheActions.putAnnouncementByIdCacheSuccess, (state, { announcement }) => ({ ...state, announcementList: [...(state?.announcementList || []), announcement], announcementListReady: true })),
    on(cacheActions.putAnnouncementByIdCacheError, (state) => ({ ...state, announcementListReady: true })),
    
    on(cacheActions.putUserByIdCache, (state, {id}) => ({ ...state, userListReady: false })),
    on(cacheActions.putUserByIdCacheSuccess, (state, { user }) => ({ ...state, userList: [...(state?.userList || []), user], userListReady: true })),
    on(cacheActions.putUserByIdCacheError, (state) => ({ ...state, userListReady: true})),

    on(cacheActions.removeAnnouncementCache, (state, { id }) => ({ ...state, announcementList: state.announcementList.filter((announcement) => announcement._id !== id) })),
    on(cacheActions.removeUserCache, (state, { id }) => ({ ...state, userList: state.userList.filter((user) => user._id !== id) })),

    on(cacheActions.clearAnnouncementCache, (state) => ({ ...state, announcementList: [] })),
    on(cacheActions.clearUserCache, (state) => ({ ...state, userList: [] })),
)