import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { ComponentStore } from "@ngrx/component-store"
import { Store } from "@ngrx/store"
import { catchError, EMPTY, Observable, switchMap, tap } from "rxjs"
import * as toastsModel from "src/app/UI/toasts/models/toasts.model"
import * as toastActions from "src/app/UI/toasts/reducers/toasts.actions"
import { toastDuration } from "src/app/UI/toasts/reducers/toasts.reducer"
import { CreateAnnouncementService } from "./create-announcement.service"
import * as createAnnouncementModel from "./models/create-announcement-model"


export const createAnnouncementNode = "createAnnouncement"

export const initialState: createAnnouncementModel.ICreateAnnouncementForm = {
    title: "",
    description: "",
    category: 0,
    price: 0
}

@Injectable()
export class CreateAnnouncementStore extends ComponentStore<createAnnouncementModel.ICreateAnnouncementForm> {

    constructor(
        private createAnnouncementService: CreateAnnouncementService,
        private store$: Store,
        private router: Router
    ) {
        super(initialState)
    }

    readonly setValue = this.updater(
        (
            state: createAnnouncementModel.ICreateAnnouncementForm,
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
            state: createAnnouncementModel.ICreateAnnouncementForm
        ) => {
            return {
                title: "",
                description: "",
                category: 0,
                price: 0
            }
        }
    )

    readonly createError = this.updater(
        (
            state: createAnnouncementModel.ICreateAnnouncementForm
        ) => {
            return {
                ...state
            }
        }
    )

    readonly form$: Observable<createAnnouncementModel.ICreateAnnouncementForm> = this.select(state => state)

    readonly create = this.effect((form$: Observable<createAnnouncementModel.ICreateAnnouncementForm>) => {
        return form$.pipe(
            switchMap((form) => this.createAnnouncementService.create({
                ...form, 
                category: +form.category
            }).pipe(
                tap({
                    next: (responseCreateAnnouncement) => {
                        if (responseCreateAnnouncement.announcement) {
                            this.store$.dispatch(toastActions.notify({ toasts: [{ text: responseCreateAnnouncement.message, type: toastsModel.toastTypeEnums.success }] }))
                            setTimeout(() => this.store$.dispatch(toastActions.removeNotify()), toastDuration)
                            return this.createSuccess()
                        }

                        this.store$.dispatch(toastActions.notify({ toasts: [{ text: createAnnouncementModel.createAnnouncementServiceCreateResponseEnums.somethingWentWrong, type: toastsModel.toastTypeEnums.error }] }))
                        setTimeout(() => this.store$.dispatch(toastActions.removeNotify()), toastDuration)
                        return this.createError()
                    },
                    error: (e) => {
                        console.log(e);
                        if (e?.error?.message) {
                            this.store$.dispatch(toastActions.notify({ toasts: [{ text: e.error.message, type: toastsModel.toastTypeEnums.error }] }))
                            setTimeout(() => this.store$.dispatch(toastActions.removeNotify()), toastDuration)
                            return this.createError()
                        }
                        return this.createError()
                    }
                }),
                catchError((e) => {
                    console.log(e);
                    if (e?.error?.message) {
                        this.store$.dispatch(toastActions.notify({ toasts: [{ text: e.error.message, type: toastsModel.toastTypeEnums.error }] }))
                        setTimeout(() => this.store$.dispatch(toastActions.removeNotify()), toastDuration)
                    }
                    this.createError()
                    return EMPTY

                })
            )),
            catchError((e) => {
                console.log(e);
                if (e?.error?.message) {
                    this.store$.dispatch(toastActions.notify({ toasts: [{ text: e.error.message, type: toastsModel.toastTypeEnums.error }] }))
                    setTimeout(() => this.store$.dispatch(toastActions.removeNotify()), toastDuration)
                }
                this.createError()
                return EMPTY

            })
        )
    })
}