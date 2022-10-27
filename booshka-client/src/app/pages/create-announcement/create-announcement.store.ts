import { HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { ComponentStore, tapResponse } from "@ngrx/component-store"
import { select, Store } from "@ngrx/store"
import { catchError, EMPTY, map, Observable, switchMap, tap } from "rxjs"
import * as cacheActions from "../../../app/store/cache/reducers/cache.actions"
import * as toastsModel from "../../../app/UI/toasts/models/toasts.model"
import * as toastActions from "../../../app/UI/toasts/reducers/toasts.actions"
import * as userModel from "../../store/user/models/user.model"
import * as userSelectors from "../../store/user/reducers/user.selectors"
import { CreateAnnouncementService } from "./create-announcement.service"
import * as createAnnouncementModel from "./models/create-announcement-model"


export const createAnnouncementNode = "createAnnouncement"

export const initialState: createAnnouncementModel.ICreateAnnouncementStoreForm = {
    title: "",
    description: "",
    category: -1,
    price: -1
}

@Injectable()
export class CreateAnnouncementStore extends ComponentStore<createAnnouncementModel.ICreateAnnouncementStoreForm> {

    constructor(
        private createAnnouncementService: CreateAnnouncementService,
        private store$: Store,
        private router: Router
    ) {
        super(initialState)
    }

    readonly setValue = this.updater(
        (
            state: createAnnouncementModel.ICreateAnnouncementStoreForm,
            { fieldName, value }: { fieldName: string, value: string }
        ) => {
            return {
                ...state,
                [fieldName]: value
            }
        }
    )



    readonly createSuccess = this.updater(
        (
            state: createAnnouncementModel.ICreateAnnouncementStoreForm
        ) => {
            return {
                title: "",
                description: "",
                category: -1,
                price: -1
            }
        }
    )

    readonly createError = this.updater(
        (
            state: createAnnouncementModel.ICreateAnnouncementStoreForm
        ) => {
            return {
                ...state
            }
        }
    )

    readonly user$: Observable<userModel.IUser> = this.store$.pipe(select(userSelectors.selectUser))
    readonly form$: Observable<createAnnouncementModel.ICreateAnnouncementStoreForm> = this.select(state => state)

    readonly create = this.effect((form$: Observable<createAnnouncementModel.ICreateAnnouncementForm>) => {
        return this.user$.pipe(
            switchMap(user => {
                return form$.pipe(
                    switchMap((form: createAnnouncementModel.ICreateAnnouncementForm): any => {
                        this.store$.dispatch(toastActions.notify({
                            toasts: [{
                                text: toastsModel.toastMessageEnums.loading,
                                type: toastsModel.toastTypeEnums.loading,
                                ready: false
                            }]
                        }))

                        const formData = new FormData()

                        for (const image of form?.imageList || []) {
                            formData.append('imageList', image)
                        }

                        formData.append('title', form.title)
                        formData.append('description', form.description)
                        formData.append('price', form.price.toString())
                        formData.append('categoryId', form.category.toString())
                        formData.append('ownerId', user._id)

                        return this.createAnnouncementService.create(formData)
                            .then(response => {
                                this.store$.dispatch(toastActions.updateNotify({ ready: true }))
                                if (response?.data?.announcement) {
                                    this.store$.dispatch(toastActions.notify({
                                        toasts: [{
                                            text: response.data.message,
                                            type: toastsModel.toastTypeEnums.success
                                        }]
                                    }))
                                    this.store$.dispatch(cacheActions.putAnnouncementCache({ announcement: response.data.announcement }))
                                    this.router.navigate(['/'])
                                    return this.createSuccess()
                                }
                                if (response?.data?.message) {
                                    this.store$.dispatch(toastActions.notify({
                                        toasts: [{
                                            text: response.data.message,
                                            type: toastsModel.toastTypeEnums.error
                                        }]
                                    }))
                                    return this.createError()
                                }
                                this.store$.dispatch(toastActions.notify({
                                    toasts: [{
                                        text: createAnnouncementModel.createAnnouncementServiceCreateResponseEnums.somethingWentWrong,
                                        type: toastsModel.toastTypeEnums.error
                                    }]
                                }))
                                return this.createError()
                            })
                            .catch(e => {
                                console.log(e);
                                this.store$.dispatch(toastActions.updateNotify({ ready: true }))
                                const toastType = e?.response?.status
                                    ? (
                                        [...e?.response?.status?.toString()][0] === 5
                                            ? toastsModel.toastTypeEnums.error
                                            : (
                                                [...e?.response?.status?.toString()][0] === 4
                                                    ? toastsModel.toastTypeEnums.warning
                                                    : toastsModel.toastTypeEnums.error
                                            )
                                    ) : toastsModel.toastTypeEnums.error
                                if (e?.response?.data?.message) {
                                    this.store$.dispatch(toastActions.notify({
                                        toasts: [{
                                            text: e?.response?.data?.message,
                                            type: toastType
                                        }]
                                    }))
                                    return this.createError()
                                }
                                this.store$.dispatch(toastActions.notify({
                                    toasts: [{
                                        text: createAnnouncementModel.createAnnouncementServiceCreateResponseEnums.somethingWentWrong,
                                        type: toastType
                                    }]
                                }))
                                return this.createError()
                            })
                    }),
                    catchError((e) => {
                        console.log(e);
                        return EMPTY
                    })
                )
            })
        )
    })
}