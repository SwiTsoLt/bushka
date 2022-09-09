import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { ComponentStore } from "@ngrx/component-store"
import { Store } from "@ngrx/store"
import { catchError, EMPTY, Observable, of, switchMap, tap } from "rxjs"

import * as toastsModel from "src/app/UI/toasts/models/toasts.model"
import * as toastActions from "src/app/UI/toasts/reducers/toasts.actions"
import { toastDuration } from "src/app/UI/toasts/reducers/toasts.reducer"
import { AuthorizationService } from "../authorization.service"
import { LoginStore } from "../login/login.store"
import * as loginModel from "../login/models/login.model"
import * as registrationModel from "./models/registration.model"

export const registrationNode = "registration"

export const initialState: registrationModel.IRegistrationForm = {
    gmail: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
    city: "",
    region: ""
}

@Injectable()
export class RegistrationStore extends ComponentStore<registrationModel.IRegistrationForm> {
    constructor(
        private authorizationService: AuthorizationService,
        private store$: Store,
        private router: Router,
        private loginStore: LoginStore
    ) {
        super(initialState)
    }

    readonly setValue = this.updater(
        (
            state: registrationModel.IRegistrationForm,
            { fieldName, value }: { fieldName: string, value: string }
        ) => ({ ...state, [fieldName]: value }))

    readonly registrationSuccess = this.updater(() => ({
        gmail: "",
        firstName: "",
        lastName: "",
        password: "",
        phone: "",
        city: "",
        region: ""
    }))

    readonly registrationError = this.updater(state => state)

    readonly form$: Observable<registrationModel.IRegistrationForm> = this.select(state => state)

    readonly registration = this.effect((form$: Observable<registrationModel.IRegistrationForm>) => {
        return form$.pipe(
            switchMap((form) => this.authorizationService.registration(form).pipe(
                tap({
                    next: (response: { message: string }) => {
                        if (response) {
                            this.loginStore.login({ gmail: form.gmail, password: form.password })
                            this.registrationSuccess()
                            return this.store$.dispatch(toastActions.notify({
                                toasts: [
                                    { text: response.message, type: toastsModel.toastTypeEnums.success }
                                ]
                            }))
                        }

                        this.registrationError()
                        return this.store$.dispatch(toastActions.notify({
                            toasts: [
                                { text: registrationModel.registrationFormErrorEnums.somethingWentWrong, type: toastsModel.toastTypeEnums.error }
                            ]
                        }))
                    },
                    error: (e) => {
                        console.log(e);
                        return this.store$.dispatch(toastActions.notify({
                            toasts: [
                                { text: registrationModel.registrationFormErrorEnums.somethingWentWrong, type: toastsModel.toastTypeEnums.error }
                            ]
                        }))
                    }
                }),
                catchError((e) => {
                    console.log(e);
                    this.registrationError()
                    if (e?.error?.message) {
                        this.store$.dispatch(toastActions.notify({ toasts: [{ text: e.error.message, type: toastsModel.toastTypeEnums.error },] }))
                    } else {
                        this.store$.dispatch(toastActions.notify({ toasts: [{ text: registrationModel.registrationFormErrorEnums.somethingWentWrong, type: toastsModel.toastTypeEnums.error },] }))
                    }
                    return EMPTY
                })
            )),
            catchError((e) => {
                console.log(e);
                this.registrationError()
                if (e?.error?.message) {
                    this.store$.dispatch(toastActions.notify({ toasts: [{ text: e.error.message, type: toastsModel.toastTypeEnums.error },] }))
                } else {
                    this.store$.dispatch(toastActions.notify({ toasts: [{ text: registrationModel.registrationFormErrorEnums.somethingWentWrong, type: toastsModel.toastTypeEnums.error },] }))
                }
                return EMPTY
            })
        )
    })
}