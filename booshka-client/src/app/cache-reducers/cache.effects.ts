import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs';
import { AuthorizationService } from '../pages/authorization/authorization.service';
import * as cacheModel from '../cache-reducers/models/cache.model'
import * as authorizationModel from '../pages/authorization/models/authorization.model';
import * as announcementModel from '../pages/main/models/main.model';
import { MainService } from '../pages/main/main.service';

@Injectable()
export class CacheEffects {

    constructor(
        private actions$: Actions,
        private authorizationService: AuthorizationService,
        private mainService: MainService,
    ) { }


    setUserById$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(cacheModel.cacheActionEnums.setUserById),
            mergeMap(
                ({ id }) => this.authorizationService.getUserById(id)
                    .pipe(
                        map((response: authorizationModel.IAuthorizationHttpResponseGetUser) => ({ type: cacheModel.cacheActionEnums.setUserByIdSuccess, payload: { key: cacheModel.reducerKeyEnums.userList, value: response.user } })),
                        catchError((e) => {
                            console.log(e);
                            return of(({ type: cacheModel.cacheActionEnums.setUserByIdError }))
                        })
                    )
            )
        )
    })

    setAnnouncementPage$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(cacheModel.cacheActionEnums.setAnnouncementPage),
            mergeMap(({ page }) => this.mainService.getPage(page).pipe(
                map((response: announcementModel.announcementGetPageResponse) => {
                    return ({ type: cacheModel.cacheActionEnums.setAnnouncementPageSuccess, payload: { key: cacheModel.reducerKeyEnums.announcementList, value: response.announcementList } })
                }),
                catchError((e) => {
                    console.log(e);
                    return of(({ type: cacheModel.cacheActionEnums.setUserByIdSuccess }))
                })
            )
            )
        )
    })
}