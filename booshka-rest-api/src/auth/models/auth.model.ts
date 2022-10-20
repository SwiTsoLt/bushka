export interface IError {
    token?: string,
    message: string,
    status: number
}

export interface IRegistrationSuccess {
    message: string,
    status: number
}

export interface ILoginSuccess {
    token: string,
    message: string,
    status: number
}


export type IRegistrationResponse = IError | IRegistrationSuccess
export type ILoginResponse = IError | ILoginSuccess

// ENUMS

export enum successEnums {
    userWasCreatedSuccessful = "Пользователь успешно зарегистрирован",
    LoggedInSuccess = "Вы успешно вошли в аккаунт"
}

export const errorEnums = {
    suchUserAlreadyExists: "Такой пользователь уже существует",
    userNotFound: (id: string) => `Пользователь с id '${id}' не найден`,
    userNotFoundByGmail: (gmail: string) => `Пользователь с gmail '${gmail}' не найден`,
    wrongPassword: "Неверный пароль",
    somethingWentWrong: "Что-то пошло не так",
    jwtExpired: "Время сессии истекло. Пожалуйста, войдите в аккаунт",
    jwtMalformed: "Войдите в аккаунт чтобы пользоваться всеми доступными функциями",
    notAcceptable: "Доступ запрещен",
}

