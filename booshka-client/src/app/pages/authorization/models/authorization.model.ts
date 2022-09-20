
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
    user: IUser,
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
    user?: IUser,
    message?: string
}


/* USER */

export enum authorizationActionEnums {
    getAndSetUserByJWT = "[Authorization Component] Get And Set User By JWT",
    getAndSetUserByJWTSuccess = "[Authorization Component] Get And Set User By JWT Success",
    getAndSetUserByJWTError = "[Authorization Component] Get And Set User By JWT Error",

    getAndSetUserById = "[Authorization Component] Get And Set User By Id",
    getAndSetUserByIdSuccess = "[Authorization Component] Get And Set User By Id Success",
    getAndSetUserByIdError = "[Authorization Component] Get And Set User By Id Error",
}

export interface IUser {
    _id: string,
    gmail: string,
    firstName: string,
    lastName: string,
    phone: string,
    city: string,
    region: string
}
