import { HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { ComponentStore, tapResponse } from "@ngrx/component-store"
import { Store } from "@ngrx/store"
import { catchError, EMPTY, map, Observable, switchMap, tap } from "rxjs"
import * as toastsModel from "src/app/UI/toasts/models/toasts.model"
import * as toastActions from "src/app/UI/toasts/reducers/toasts.actions"
import { toastDuration } from "src/app/UI/toasts/reducers/toasts.reducer"
import { CreateAnnouncementService } from "./create-announcement.service"
import * as createAnnouncementModel from "./models/create-announcement-model"


export const createAnnouncementNode = "createAnnouncement"

export const initialState: createAnnouncementModel.ICreateAnnouncementStoreForm = {
    title: "",
    description: "",
    category: 0,
    price: 0
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
                category: 0,
                price: 0
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

    readonly form$: Observable<createAnnouncementModel.ICreateAnnouncementStoreForm> = this.select(state => state)
        
    readonly create = this.effect((form$: Observable<createAnnouncementModel.ICreateAnnouncementForm>) => {
        return form$.pipe(
            switchMap((form: createAnnouncementModel.ICreateAnnouncementForm): any => {
                const formData = new FormData()

                for(const image of form?.imageList || []) {
                    formData.append('imageList', image)
                }

                formData.append('title', form.title)
                formData.append('description', form.description)
                formData.append('price', form.price.toString())
                formData.append('category', form.category.toString())

                return this.createAnnouncementService.create(formData)
                .then(response => {
                    if (response.data.announcement) {
                        this.store$.dispatch(toastActions.notify({ toasts: [{
                            text: response.data.message,
                            type: toastsModel.toastTypeEnums.success
                        }] }))
                        return this.createSuccess()
                    }
                    this.store$.dispatch(toastActions.notify({ toasts: [{
                        text: response.data.message || createAnnouncementModel.createAnnouncementServiceCreateResponseEnums.somethingWentWrong,
                        type: toastsModel.toastTypeEnums.error
                    }] }))
                    return this.createError()
                })
                .catch(e => {
                    console.log(e);

                    this.store$.dispatch(toastActions.notify({ toasts: [{
                        text: createAnnouncementModel.createAnnouncementServiceCreateResponseEnums.somethingWentWrong,
                        type: toastsModel.toastTypeEnums.error
                    }] }))
                    return this.createError()
                })
            }),
            catchError((e) => {
                console.log(e);
                return EMPTY
            })
        )
    })
}