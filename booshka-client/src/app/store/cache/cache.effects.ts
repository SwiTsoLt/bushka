import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, take, catchError } from 'rxjs/operators';
import { AuthorizationService } from 'src/app/pages/authorization/authorization.service';
import { MainService } from 'src/app/pages/main/main.service';
import * as toastModel from 'src/app/UI/toasts/models/toasts.model';
import * as toastActions from 'src/app/UI/toasts/reducers/toasts.actions';
import * as cacheModel from './models/cache.model';
import * as cacheSelectors from './reducers/cache.selectors';
import * as loginModel from 'src/app/pages/authorization/login/models/login.model';
import * as cacheActions from './reducers/cache.actions';
import * as mainModel from '../../pages/main/models/main.model';
import { selectUser } from '../user/reducers/user.selectors';


@Injectable()
export class CacheEffects {

    constructor(
        private actions$: Actions,
        private mainService: MainService,
        private store$: Store,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService
    ) { }

    getAnnouncementList$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(cacheModel.cacheActionEnums.getAnnouncementCacheList),
                mergeMap(() => this.store$.pipe(select(cacheSelectors.selectCacheAnnouncementList))
                    .pipe(
                        take(1),
                        mergeMap(announcementCacheList => {
                            if (!announcementCacheList.length) {
                                return this.route.queryParams.pipe(
                                    mergeMap(params => {
                                        const page = params['page']
                                        return this.mainService.getPage((page && typeof page === 'number') ? page : 1)
                                            .pipe(
                                                map(response => {
                                                    if (response.announcementList) {
                                                        return ({ type: cacheModel.cacheActionEnums.getAnnouncementCacheListSuccess, announcementList: response.announcementList })
                                                    }

                                                    if (response.message) {
                                                        this.store$.dispatch(toastActions.notify({ toasts: [{ text: response.message, type: toastModel.toastTypeEnums.error }] }))
                                                        return ({ type: cacheModel.cacheActionEnums.getAnnouncementCacheListError })
                                                    }

                                                    return ({ type: cacheModel.cacheActionEnums.getAnnouncementCacheListError })

                                                }),
                                                catchError(e => {
                                                    console.log(e);
                                                    return of({ type: cacheModel.cacheActionEnums.getAnnouncementCacheListError })
                                                })
                                            )
                                    })
                                )
                            }

                            return this.route.queryParams.pipe(
                                map(() => ({ type: cacheModel.cacheActionEnums.getAnnouncementCacheListAbolition }))
                            )
                        })
                    )
                )
            )
    })

    getCacheUserList$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(cacheModel.cacheActionEnums.getAnnouncementCacheListSuccess),
            mergeMap(({ announcementList }: { announcementList: mainModel.IAnnouncement[] }) => this.store$.pipe(select(cacheSelectors.selectCacheUserList)).pipe(
                take(1),
                mergeMap((cacheUserList) => this.store$.pipe(select(selectUser)).pipe(
                    map(user => {
                        const announcementOwnerIdList = announcementList.reduce((acc: string[], cur) => ([...acc, cur.ownerId]), [])
                        const cacheUserIdList = cacheUserList.reduce((acc: string[], cur) => ([...acc, cur._id]), [])

                        const uniqUserIdList = Array.from(new Set(announcementOwnerIdList)).filter(id => cacheUserIdList.indexOf(id) === -1);

                        uniqUserIdList.forEach(ownerId => {
                            user._id !== ownerId && this.store$.dispatch(cacheActions.putUserByIdCache({ id: ownerId }))
                        })

                        return ({ type: cacheModel.cacheActionEnums.getUserCacheListSuccess })
                    })
                ))
            ))
        )
    })

    putUserByIdCache$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(cacheModel.cacheActionEnums.putUserByIdCache),
            mergeMap(({ id }) => this.authorizationService.getUserById(id).pipe(
                map(response => {
                    if (response?.user) {
                        return ({ type: cacheModel.cacheActionEnums.putUserByIdCacheSuccess, user: response.user })
                    }

                    if (response?.message) {
                        this.store$.dispatch(toastActions.notify({ toasts: [{ text: response.message, type: toastModel.toastTypeEnums.error }] }))
                        return ({ type: cacheModel.cacheActionEnums.putUserByIdCacheError })
                    }

                    this.store$.dispatch(toastActions.notify({ toasts: [{ text: loginModel.loginFormErrorEnums.somethingWentWrong, type: toastModel.toastTypeEnums.error }] }))
                    return ({ type: cacheModel.cacheActionEnums.putUserByIdCacheError })
                }),
                catchError(e => {
                    console.log(e);
                    return of({ type: cacheModel.cacheActionEnums.putUserByIdCacheError })
                })
            ))
        )
    })
}