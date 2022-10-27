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