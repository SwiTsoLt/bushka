import { UserDocument } from "../schemas/user.schema"

export type IUserResponse =
    IUserFoundSuccessResponse |
    IUserFoundErrorResponse

export interface IUserFoundSuccessResponse {
    user: UserDocument
}

export interface IUserFoundErrorResponse {
    message: string
}

// City

export interface City {
    title: string,
    index: number,
    regions: IRegion[]
}

export interface IRegion {
    title: string,
    index: number
}

export interface ICityResponse {
    cityList: City[],
    message: string
}

export interface ICityServiceResponse {
    cityList?: City[],
    message?: string,
    status: number
}

// SERVICE

export interface IUserServiceResponse {
    user?: IUserServiceResponseUser,
    favorites?: string[],
    announcementIdList?: string[],
    message?: string,
    status: number
}

export interface IUserServiceResponseUser {
    _id: string,
    gmail: string,
    firstName: string,
    lastName: string,
    city: string,
    region: string,
    phone: string,
    announcementIdList: string[],
    ideas: string[],
    registrationDate: Date
}


export interface IUserAnnouncementIdListServiceResponse {
    announcementIdList?: string[],
    message?: string,
    status: number
}

// RESPONSE

export enum UserServiseResponseEnumsSuccess {
    edit = "Пользователь успешно изменен"
}