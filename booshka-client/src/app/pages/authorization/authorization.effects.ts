import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, exhaustMap, map, mergeMap, of, tap } from "rxjs";

import * as toastActions from "../../UI/toasts/reducers/toasts.actions"
import * as toastModel from "../../UI/toasts/models/toasts.model"
import { AuthorizationService } from "./authorization.service";
import * as authorizationModel from "./models/authorization.model";
import { loginFormErrorEnums } from "./login/models/login.model";


@Injectable()
export class AuthorizationEffects {

    constructor(
        private actions$: Actions,
        private authorizationService: AuthorizationService,
        private store$: Store
    ) { }

    getAndSetUserByJWT$ = createEffect(() => this.actions$.pipe(
        ofType(authorizationModel.authorizationActionEnums.getAndSetUserByJWT),
        mergeMap((action: { token: string, type: string }) => this.authorizationService.getUserByJWT(action.token).pipe(
            map((response) => {
                if (response.user) {
                    return ({ type: authorizationModel.authorizationActionEnums.getAndSetUserByJWTSuccess, payload: { user: response.user } })
                }
                if (response.message) {
                    this.store$.dispatch(toastActions.notify({ toasts: [{ text: response.message, type: toastModel.toastTypeEnums.notify }] }))
                }
                return ({ type: authorizationModel.authorizationActionEnums.getAndSetUserByJWTError })
            }),
            catchError((e) => {
                console.log(e);
                this.store$.dispatch(toastActions.notify({ toasts: [{ text: loginFormErrorEnums.somethingWentWrong, type: toastModel.toastTypeEnums.notify }] }))
                return of({ type: authorizationModel.authorizationActionEnums.getAndSetUserByJWTError })
            })
        )
        ),
        catchError((e) => {
            console.log(e);
            this.store$.dispatch(toastActions.notify({ toasts: [{ text: loginFormErrorEnums.somethingWentWrong, type: toastModel.toastTypeEnums.notify }] }))
            return of({ type: authorizationModel.authorizationActionEnums.getAndSetUserByJWTError })
        })
    ))

}