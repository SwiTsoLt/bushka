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

export enum errorEnums {
    suchUserAlreadyExists = "Такой пользователь уже существует",
    userNotFound = "Пользователь не найден",
    wrongPassword = "Неверный пароль",
    somethingWentWrong = "Что-то пошло не так"
}

