
export interface IAnnouncement {
    _id: string,
    title: string,
    description: string,
    category: ICategory,
    imageLinkList: string[],
    price: number,
    ownerId: string,
    createDate: Date
}

export interface ICategory {
    _id: string,
    id: number,
    title: string
}

export enum announcementActionsEnum {
    setAnnouncementList = "[Main Component] Set Announcement List",
    setAnnouncementListSuccess = "[Main Component] Set Announcement List Success",
    setAnnouncementListError = "[Main Component] Set Announcement List Error"
}

export const announcementUrls = {
    getPage: (page: number) => `/api/announcement?page=${page}`
}

export interface announcementGetPageResponse {
    announcementList: IAnnouncement[],
    message?: string
}