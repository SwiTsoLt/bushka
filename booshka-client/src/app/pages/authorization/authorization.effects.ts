import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, exhaustMap, map, mergeMap, of, tap } from "rxjs";

import { AuthorizationService } from "./authorization.service";
import * as authorizationModel from "./models/authorization.model";


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

                return ({ type: authorizationModel.authorizationActionEnums.getAndSetUserByJWTError })
            }),
            catchError(() => of({ type: authorizationModel.authorizationActionEnums.getAndSetUserByJWTError }))
        )
        )
    ))

}