import { AnnouncementCategoryChildren } from "../schemas/announcement-category-children.schema"
import { AnnouncementCategory } from "../schemas/announcement-category.schema"
import { Announcement } from "../schemas/announcement.schema"
import { IUserServiceResponseUser } from "../../user/models/user.model"

/* Get all */

export interface IAnnouncementGetAllResponse {
    announcementList?: Announcement,
    status: number
}


export interface IAnnouncementGetAllServiceResponse {
    announcementList?: Announcement[],
    message?: string,
    status: number
}

/* Get one */

export interface IAnnouncementGetOneResponse {
    announcement?: Announcement,
    message?: string
}

export interface IAnnouncementGetOneServiceResponse {
    announcement?: Announcement,
    message?: string,
    status: number
}

/* Get category all */

export interface IAnnouncementCategoryGetAllServiceResponse {
    categoryList: AnnouncementCategory[],
    message?: string,
    status: number
}

/* Create */

export interface IAnnouncementCreateResponse {
    announcement?: Announcement,
    message: string
}

export interface IAnnouncementCreateServiceResponse {
    user?: IUserServiceResponseUser,
    announcement?: Announcement,
    message: string,
    status: number
}

/* Delete */

export interface IAnnouncementDeleteResponse {
    announcement?: Announcement,
    message: string
}

export interface IAnnouncementDeleteServiceResponse {
    user?: IUserServiceResponseUser,
    announcement?: Announcement,
    message: string,
    status: number
}

/* Response Enums */

export const announcementSuccessEnum = {
    created: "Объявление успешно создано!",
    delete: "Объявление удалено успешно!"
}

export const announcementErrorEnum = {
    notFount: (id: string) => `Объявление с id '${id}' не найдено`,
    somethingWentWrong: "Что-то пошло не так"
}

/* Validate Error Enum */

export enum announcementValidateErrorEnums {
    title = "Заголовок не должен быть пустым",
    price = "Укажите цену",
    category = "Выберите категорию"
}