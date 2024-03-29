import { IAnnouncement } from "../../main/models/main.model"

export interface ICategory {
    id: number,
    title: string,
    children: ICategoryChildren[]
}

export interface ICategoryChildren {
    id: number,
    title: string
}

export interface ICreateAnnouncementForm {
    title: string,
    description: string,
    category: number,
    price: number,
    imageList: File[] | null
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
    getCategoryList = "/api/announcement/category",
    create = "/api/announcement",
}

export interface createAnnouncementServiceCreateResponse {
    announcement?: IAnnouncement,
    message: string
}

export enum createAnnouncementServiceCreateResponseEnums {
    somethingWentWrong = "Что-то пошло не так"
}