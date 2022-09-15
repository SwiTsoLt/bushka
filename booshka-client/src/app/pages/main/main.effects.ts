import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { MainService } from "./main.service";
import { announcementActionsEnum } from "./models/main.model";

@Injectable()
export class MainEffects {

    constructor(
        private actions$: Actions,
        private mainService: MainService
    ) { }

    loadAnnouncementList$ = createEffect(() => this.actions$.pipe(
        ofType(announcementActionsEnum.setAnnouncementList),
        mergeMap(() => this.mainService.getAll()
            .pipe(
                map(response => {
                    return ({ type: announcementActionsEnum.setAnnouncementListSuccess, payload: response.announcementList })
                }),
                catchError((e) => {
                    console.log(e);
                    return of({ type: announcementActionsEnum.setAnnouncementListError })
                })
            )
        )
    ))
}