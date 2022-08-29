
export interface IAnnouncement {
    title: string,
    description: string,
    price: number,
    ownerId: string
}

export enum announcementActionsEnum {
    setAnnouncementList = "[Main Component] Set Announcement List",
    setAnnouncementListSuccess = "[Main Component] Set Announcement List Success",
    setAnnouncementListError = "[Main Component] Set Announcement List Error"
}

export enum announcementUrlsEnum {
    getAll = "/api/announcement"
}

export interface announcementGetAllResponse {
    announcementList: IAnnouncement[],
    message?: string
}