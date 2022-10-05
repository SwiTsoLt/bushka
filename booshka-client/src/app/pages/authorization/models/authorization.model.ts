import * as userModel  from "src/app/store/user/models/user.model"

export const authorizationHttpUrlEnums = {
    registration: "/api/auth/registration",
    login: "/api/auth/login",
    getUserById: (id: string) => `/api/user/${id}`,
    getUserByJWT: "/api/user"
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