import * as userModel  from "src/app/store/user/models/user.model"

export const authorizationHttpUrlEnums = {
    registration: "/api/auth/registration",
    login: "/api/auth/login",
    getUserById: (id: string) => `/api/user/${id}`,
    getUserByJWT: "/api/user",
    editUserByJWT: "/api/user/edit",
    toggleIdea: "/api/user/toggleIdea",
    getCityAll: "/api/user/city",
    removeIdea: (id: string) => `/api/user/removeIdea?id=${id}`
}

export enum authorizationGuardEnums {
    userNotAuthorized = "Пользователь не авторизован"
}

export interface IAuthorizationHttpResponseRegistration {
    message: string
}

export interface IAuthorizationHttpResponseLogin {
    user: userModel.IUser,
    token: string,
    message: string,
    status: number
}

export interface IAuthorizationHttpResponseErrors {
    message: string,
    status: number
}

export type AuthorizationResponseRegistration =
    IAuthorizationHttpResponseRegistration |
    IAuthorizationHttpResponseErrors

export interface IAuthorizationHttpResponseGetUser {
    user?: userModel.IUser,
    message?: string
}

export interface IPutUserIdeaResponse {
    user: userModel.IUser,
    message?: string
}

export interface IRemoveUserIdeaResponse {
    user: userModel.IUser,
    message?: string
}

// City

export interface ICityResponse {
    cityList: ICity[],
    message?: string
}

export interface ICity {
    title: string,
    index: number,
    regions: IRegion[]
}

export interface IRegion {
    title: string,
    index: number
}