
export interface IAnnouncement {
    title: string,
    description: string,
    category: number,
    price: number,
    imageLinkList: string[],
    ownerId: string
}

export interface ICreateAnnouncementForm {
    title: string,
    description: string,
    category: number,
    price: number,
    imageList: FileList | null
}

export interface ICreateAnnouncementStoreForm {
    title: string,
    description: string,
    category: number,
    price: number
}

export interface ICreateAnnouncementServiceForm {
    title: string,
    price: number,
    imageLinkList: string[],
    ownerId: string
}

export enum createAnnouncementServiceUrlEnums {
    create = "/api/announcement"
}

export interface createAnnouncementServiceCreateResponse {
    announcement?: ICreateAnnouncementServiceForm,
    message: string
}

export enum createAnnouncementServiceCreateResponseEnums {
    somethingWentWrong = "Что-то пошло не так"
}