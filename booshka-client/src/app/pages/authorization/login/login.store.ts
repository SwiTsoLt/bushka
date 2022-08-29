import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, Observable, of, switchMap, tap } from "rxjs";
import { AuthorizationService } from "../authorization.service";
import * as authorizationActions from "../reducers/authorization.actions";

import * as loginModel from "./models/login.model";
import { Store } from "@ngrx/store";
import * as toastsActions from "src/app/UI/toasts/reducers/toasts.actions";
import * as toastsModel from "src/app/UI/toasts/models/toasts.model";
import { toastDuration } from "src/app/UI/toasts/reducers/toasts.reducer";
import { Router } from "@angular/router";

export const loginNode = "login"
export const localStorageNameNode = "booshka"

export const initialState: loginModel.ILoginForm = {
    gmail: "",
    password: ""
}

@Injectable()
export class LoginStore extends ComponentStore<loginModel.ILoginForm> {
    constructor(
        private authorizationService: AuthorizationService,
        private store$: Store,
        private router: Router
    ) {
        super(initialState)
    }

    readonly setValue = this.updater(
        (
            state: loginModel.ILoginForm,
            { fieldName, value }: { fieldName: string, value: string }
        ) => {
            return {
                ...state,
                [fieldName]: value
            }
        })

    readonly loginSuccess = this.updater(() => ({ gmail: "", password: "" }))

    readonly loginError = this.updater(
        (
            state: loginModel.ILoginForm
        ) => state)

    readonly form$: Observable<loginModel.ILoginForm> = this.select(state => state)

    readonly login = this.effect((form$: Observable<loginModel.ILoginForm>) => {
        return form$.pipe(
            switchMap((form) => this.authorizationService.login(form).pipe(
                switchMap((response) => {

                    const data = JSON.parse(localStorage.getItem(localStorageNameNode) || "{}")
                    localStorage.setItem(localStorageNameNode, JSON.stringify({ ...data, token: response?.token }))

                    return this.authorizationService.getUserByJWT(response?.token).pipe(
                        tap({
                            next: (responseGetUser) => {
                                if (responseGetUser.user) {
                                    this.loginSuccess()
                                    this.store$.dispatch(authorizationActions.getAndSetUserByJWTSuccess({ payload: { user: responseGetUser.user } }))
                                    if (response.message) {
                                        this.store$.dispatch(toastsActions.notify({ toasts: [{ text: response.message, type: toastsModel.toastTypeEnums.success }] }))
                                        setTimeout(() => this.store$.dispatch(toastsActions.removeNotify()), toastDuration)
                                    }
                                    return this.router.navigate(['/'])
                                }

                                this.store$.dispatch(toastsActions.notify({ toasts: [{ text: loginModel.loginFormErrorEnums.somethingWentWrong, type: toastsModel.toastTypeEnums.error }] }))
                                setTimeout(() => this.store$.dispatch(toastsActions.removeNotify()), toastDuration)
                                return this.loginError()
                            },
                            error: (e) => {
                                console.log(e);
                                this.store$.dispatch(toastsActions.notify({ toasts: [{ text: loginModel.loginFormErrorEnums.somethingWentWrong, type: toastsModel.toastTypeEnums.error }] }))
                                setTimeout(() => this.store$.dispatch(toastsActions.removeNotify()), toastDuration)
                                return this.loginError()
                            }
                        }),
                        catchError((e) => {
                            console.log(e);
                            this.loginError()
                            if (e?.error?.message) {
                                this.store$.dispatch(toastsActions.notify({ toasts: [{ text: e.error.message, type: toastsModel.toastTypeEnums.error }] }))
                                setTimeout(() => this.store$.dispatch(toastsActions.removeNotify()), toastDuration)
                            }
                            return EMPTY
                        })
                    )
                }),
                catchError((e) => {
                    this.loginError()
                    if (e?.error?.message) {
                        this.store$.dispatch(toastsActions.notify({ toasts: [{ text: e.error.message, type: toastsModel.toastTypeEnums.error }] }))
                        setTimeout(() => this.store$.dispatch(toastsActions.removeNotify()), toastDuration)
                    }
                    return of({ type: authorizationActions.getAndSetUserByJWTError })
                })
            )),
            catchError((e) => {
                this.loginError()
                if (e?.error?.message) {
                    this.store$.dispatch(toastsActions.notify({ toasts: [{ text: e.error.message, type: toastsModel.toastTypeEnums.error }] }))
                    setTimeout(() => this.store$.dispatch(toastsActions.removeNotify()), toastDuration)
                }
                return of({ type: authorizationActions.getAndSetUserByJWTError })
            })
        )
    })
}