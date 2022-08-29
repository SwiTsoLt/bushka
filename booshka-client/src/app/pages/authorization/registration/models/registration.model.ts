import { FormControl } from "@angular/forms"

export enum registrationActionEnums {
    setValue = "[Registration Component] Set value",
    registration = "[Registration Component] Registration",
    reset = "[Registration Component] Reset",
    registrationSuccess = "[Registration Effects] Registration Success",
    registrationError = "[Registration Component] Registration Error",
}

export enum registrationFormErrorEnums {
    required = "Данное поле является обязательным",
    minLengthPassword = "Минимальная длинна пароля - 6 символов",
    wrongField = "Некорректный формат",
    somethingWentWrong = "Ошибка регистрации"
}

/* Forms interfaces */

export interface IRegistrationForm {
    gmail: string,
    firstName: string,
    lastName: string,
    password: string,
    phone: string,
    city: string,
    region: string
}

export interface IRegistrationFormErrors {
    [key: string]: string
}

export interface IRegistrationControlForm {
    gmail: FormControl<string>,
    firstName: FormControl<string>,
    lastName: FormControl<string>,
    password: FormControl<string>,
    confirmPassword: FormControl<string>,
    phone: FormControl<string>,
    city: FormControl<string>,
    region: FormControl<string>
}

export interface ICityList {
    [key: string]: ICity
}

export interface ICity {
    index: number,
    regions: IRegionsList
}

export interface IRegionsList {
    [key: string]: IRegion
}

export interface IRegion {
    index: number
}