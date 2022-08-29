import { FormControl } from "@angular/forms";
import * as registrationModel from "../../registration/models/registration.model";

export enum loginFormErrorEnums {
    required = "Данное поле является обязательным",
    minLengthPassword = "Минимальная длинна пароля - 6 символов",
    wrongField = "Некорректный формат",
    somethingWentWrong = "Ошибка входа в аккаунт"
}

export interface ILoginControlForm {
    gmail: FormControl<string>,
    password: FormControl<string>
}

export interface ILoginForm {
    gmail: string,
    password: string
}

export interface ILoginFormErrors {
    [key: string]: string
}

export interface IStateSub {
    login: ILoginForm,
    registration: registrationModel.IRegistrationForm
}

export enum loginActionsEnum {
    setValue = "[Login Component] Set value",
    login = "[Login Component] Login",
    reset = "[Login Component] Reset",
    loginSuccess = "[Login Effects] Login Success",
    loginError = "[Login Effects] Login Error",
}