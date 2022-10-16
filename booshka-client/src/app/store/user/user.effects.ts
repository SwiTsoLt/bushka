import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, tap, catchError } from 'rxjs/operators';
import { AuthorizationService } from 'src/app/pages/authorization/authorization.service';
import { MainService } from 'src/app/pages/main/main.service';
import * as toastActions from 'src/app/UI/toasts/reducers/toasts.actions';
import * as toastModel from 'src/app/UI/toasts/models/toasts.model';
import * as userModel from './models/user.model';
import * as userActions from './reducers/user.actions';
import * as loginModel from 'src/app/pages/authorization/login/models/login.model';
import { booshkaNode } from 'src/app/models/app.models';
import * as cacheModel from '../cache/models/cache.model';
import * as cacheActions from '../cache/reducers/cache.actions';

@Injectable()
export class UserEffects {

    constructor(
        private actions$: Actions,
        private mainService: MainService,
        private authorizationService: AuthorizationService,
        private store$: Store,
        private route: ActivatedRoute
    ) { }

    setUserByJWT$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(userModel.userActionEnums.setUserByJWT),
            mergeMap(() => this.authorizationService.getUserByJWT()
                .pipe(
                    map(response => {
                        if (response?.user) {
                            return ({ type: userModel.userActionEnums.setUserByJWTSuccess, user: response.user })
                        }

                        if (response?.message) {
                            this.store$.dispatch(toastActions.notify({ toasts: [{ text: response.message, type: toastModel.toastTypeEnums.error }] }))
                            return ({ type: userModel.userActionEnums.setUserByJWTError })
                        }
                        this.store$.dispatch(toastActions.notify({ toasts: [{ text: loginModel.loginFormErrorEnums.somethingWentWrong, type: toastModel.toastTypeEnums.error }] }))
                        return ({ type: userModel.userActionEnums.setUserByJWTError })
                    }),
                    catchError((e) => {
                        console.log(e);
                        e?.error?.message
                            ? this.store$.dispatch(toastActions.notify({ toasts: [{ text: e.error.message, type: e?.status === 401 ? toastModel.toastTypeEnums.notify : toastModel.toastTypeEnums.error }] }))
                            : this.store$.dispatch(toastActions.notify({ toasts: [{ text: loginModel.loginFormErrorEnums.somethingWentWrong, type: toastModel.toastTypeEnums.error }] }))
                        return of(({ type: userModel.userActionEnums.setUserByJWTError }))
                    })
                ))
        )
    })

    logout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(userModel.userActionEnums.logout),
            map(() => {
                const data = localStorage.getItem(booshkaNode) || ""
                const parsedData = JSON.parse(data) || {}
                if (parsedData) {
                    this.store$.dispatch(userActions.clear())
                    const newData = JSON.stringify({
                        ...parsedData,
                        token: ""
                    })
                    localStorage.setItem(booshkaNode, newData)
                    return ({ type: userModel.userActionEnums.logoutSuccess })
                }
                return ({ type: userModel.userActionEnums.logoutError })
            }),
            catchError(e => {
                console.log(e);
                return of({ type: userModel.userActionEnums.logoutError })
            })
        )
    })
}