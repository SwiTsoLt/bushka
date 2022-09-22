import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, map } from "rxjs";
import * as toastModel from "./models/toasts.model";
import { removeNotify } from "./reducers/toasts.actions";
import { toastDuration } from "./reducers/toasts.reducer";


@Injectable()
export class ToastEffects {

    constructor(
        private actions$: Actions,
        private store$: Store
    ) { }

    removeNotify$ = createEffect(() => this.actions$.pipe(
        ofType(toastModel.toastActionEnums.notify),
        map(({ toasts }: { toasts: toastModel.IToast[] }) => {
            if (toasts[0].type !== toastModel.toastTypeEnums.loading) {
                setTimeout(() => {
                    this.store$.dispatch(removeNotify())
                    return ({ type: toastModel.toastActionEnums.removeNotify })
                }, toastDuration)
            }
            return ({ type: "null_action" })
        }),
        catchError(e => {
            console.log(e);
            return EMPTY
        })
    ))

    removeLoadingNotify$ = createEffect(() => this.actions$.pipe(
        ofType(toastModel.toastActionEnums.updateNotify),
        map(() => {
            setTimeout(() => {
                this.store$.dispatch(removeNotify())
                return ({ type: toastModel.toastActionEnums.removeNotify })
            }, 200 + 500)
            return ({ type: "null_action" })
        }),
        catchError(e => {
            console.log(e);
            return EMPTY
        })
    ))

}