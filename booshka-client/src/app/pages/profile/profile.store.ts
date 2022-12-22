import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store, select } from "@ngrx/store";
import { map, Observable, take, of, mergeMap, switchMap, exhaustMap, tap, catchError, EMPTY, observable, pipe } from "rxjs";
import * as userSelctors from "../../store/user/reducers/user.selectors";
import * as userModel from "../../store/user/models/user.model";
import * as profileModel from "./models/profile.model";
import * as cacheSelectors from "../../store/cache/reducers/cache.selectors";
import * as cacheActions from "../../store/cache/reducers/cache.actions";
import * as mainModel from "../main/models/main.model";
import { AuthorizationService } from "../authorization/authorization.service";
import * as userActions from "../../store/user/reducers/user.actions";
import * as toastActions from "../../UI/toasts/reducers/toasts.actions";
import * as toastModel from "../../UI/toasts/models/toasts.model";
import * as loginModel from "../authorization/login/models/login.model";

export const initialState: profileModel.IProfileStore = {
    form: {
        firstName: "",
        lastName: "",
        city: "",
        region: "",
        phone: ""
    },
    user: {
        _id: "",
        gmail: "",
        firstName: "",
        lastName: "",
        avatarLink: "",
        city: "",
        region: "",
        phone: "",
        announcementIdList: [],
        ideas: []
    },
    announcementList: [],
    isOwner: false,
    isEdit: false,
}

@Injectable()
export class ProfileStore extends ComponentStore<profileModel.IProfileStore> {


    constructor(
        private store$: Store,
        private authorizationService: AuthorizationService
    ) {
        super(initialState)
    }

    private readonly user$: Observable<userModel.IUser> = this.store$.pipe(select(userSelctors.selectUser))
    private readonly userReady$: Observable<boolean> = this.store$.pipe(select(userSelctors.selectUserReady))
    public cacheUserList$: Observable<userModel.IUser[]> = this.store$.pipe(select(cacheSelectors.selectCacheUserList))
    public cacheUserListReady$: Observable<boolean> = this.store$.pipe(select(cacheSelectors.selectCacheUserListReady))
    public cacheUserAnnouncementList$: Observable<mainModel.IAnnouncement[]> = this.store$.pipe(select(cacheSelectors.selectCacheAnnouncementList))

    public cacheUserAnnouncementListReady$: Observable<boolean> = this.store$.pipe(select(cacheSelectors.selectCacheAnnouncementListReady))
    readonly setValue = this.updater((state: profileModel.IProfileStore, { key, value }: { key: string, value: string }) => ({
        ...state, form: { ...state.form, [key]: value }
    }))

    readonly setCurrentUser = this.updater((state) => state)
    readonly setCurrentUserSuccess = this.updater((state, { user }: { user: userModel.IUser }) => ({
        ...state,
        user
    }))
    readonly setCurrentUserError = this.updater((state) => state)
    readonly setCurrentUserAnnouncementListSuccess = this.updater((state, { announcementList }: { announcementList: mainModel.IAnnouncement[] }) => ({
        ...state,
        announcementList
    }))
    readonly setCurrentUserAnnouncementListError = this.updater((state) => state)
    readonly setCurrentUserIsOwnerSuccess = this.updater((state, { isOwner }: { isOwner: boolean }) => ({
        ...state,
        isOwner
    }))
    readonly setCurrentUserIsOwnerError = this.updater((state) => state)

    readonly sendSuccess = this.updater((state, newUser: userModel.IUser) => ({
        ...state,
        user: newUser
    }))
    readonly sendError = this.updater((state) => state)
    readonly toggleEdit = this.updater(state => ({ ...state, isEdit: !state.isEdit }))

    readonly isEdit$: Observable<boolean> = this.select(state => state.isEdit)
    readonly form$: Observable<profileModel.IProfileForm> = this.select(state => state.form)
    readonly currentUser$: Observable<userModel.IUser> = this.select(state => state.user)
    readonly currentUserAvatarUrl$: Observable<string> = this.select(state => state.user.avatarLink)
    readonly currentUserAnnouncementList$: Observable<mainModel.IAnnouncement[]> = this.select(state => state.announcementList)
    readonly currentUserIsOwner$: Observable<boolean> = this.select(state => state.isOwner)

    readonly send = this.effect((file$: Observable<FileList | null>) => {
        return file$.pipe(
            map((fileList: FileList | null) => {
                this.form$.subscribe(form => {
                    this.authorizationService.editUserByJWT(form, fileList)
                        .then(response => {
                            if (response?.data?.user) {
                                this.store$.dispatch(userActions.setUserByJWTSuccess({ user: response.data.user }))
                                this.setCurrentUserSuccess({ user: response.data.user })
                                response.data?.message && this.store$.dispatch(
                                    toastActions.notify({
                                        toasts: [{
                                            text: response.data.message,
                                            type: toastModel.toastTypeEnums.success
                                        }]
                                    })
                                )
                                return this.toggleEdit()
                            }
                            this.store$.dispatch(
                                toastActions.notify({
                                    toasts: [{
                                        text: loginModel.loginFormErrorEnums.somethingWentWrong,
                                        type: toastModel.toastTypeEnums.success
                                    }]
                                })
                            )
                            return this.toggleEdit()
                        })
                        .catch(e => {
                            console.log(e);
                            if (e?.message) {
                                this.store$.dispatch(
                                    toastActions.notify({
                                        toasts: [{
                                            text: e.message,
                                            type: toastModel.toastTypeEnums.success
                                        }]
                                    })
                                )
                                return this.toggleEdit()
                            }
                            this.store$.dispatch(
                                toastActions.notify({
                                    toasts: [{
                                        text: loginModel.loginFormErrorEnums.somethingWentWrong,
                                        type: toastModel.toastTypeEnums.success
                                    }]
                                })
                            )
                            return this.toggleEdit()
                        })
                }
                )
            })
        )

    })

    readonly clear = this.effect((_$) => _$.pipe(map(() => {
        this.currentUser$.subscribe(currentUser => {
            this.setCurrentUserSuccess({ user: currentUser })
        })
    })))

    readonly getCurrentUser = this.effect((id$: Observable<string>) => {
        return id$.pipe(
            map((id: string) => {
                this.getCurrentUserObserver(id).subscribe(user => {
                    if (user) {
                        return this.setCurrentUserSuccess({ user })
                    }
                    return this.setCurrentUserError()
                })
            }),
            catchError((error) => {
                console.log(error);
                this.setCurrentUserError()
                return EMPTY
            })
        )
    })

    readonly getCurrentUserAnnouncementList = this.effect((id$: Observable<string>) => {
        return id$.pipe(
            map((id: string) => {
                this.getCurrentUserObserver(id).subscribe(user => {
                    if (user) {
                        this.getCurrentUserAnnouncementListObserver(user).subscribe(announcementList => {
                            this.setCurrentUserAnnouncementListSuccess({ announcementList })
                        })
                    }
                    return this.setCurrentUserAnnouncementListError()
                })
            }),
            catchError((error) => {
                console.log(error);
                this.setCurrentUserAnnouncementListError()
                return EMPTY
            })
        )
    })

    readonly getCurrentUserIsOwner = this.effect((id$: Observable<string>) => {
        return id$.pipe(
            map((id: string) => {
                this.userReady$.subscribe(userReady => {
                    if (userReady) {
                        this.user$.pipe(take(1)).subscribe(user => {
                            if (user._id === id) {
                                return this.setCurrentUserIsOwnerSuccess({ isOwner: true })
                            }
                            return this.setCurrentUserIsOwnerSuccess({ isOwner: false })
                        })
                    }
                })
            }),
            catchError((error) => {
                console.log(error);
                this.setCurrentUserIsOwnerError()
                return EMPTY
            })
        )
    })

    private getCurrentUserObserver(id: string): Observable<userModel.IUser | null> {
        return new Observable((observer => {
            if (!id?.trim()?.length) {
                this.userReady$.subscribe(userReady => userReady
                    && this.user$.pipe(take(1)).subscribe(user => user
                        ? observer.next(user)
                        : observer.next(null)
                    )
                )
            } else {
                this.userReady$.subscribe(userReady => {
                    if (userReady) {
                        this.user$.pipe(take(1)).subscribe(user => {
                            if (user._id === id) {
                                observer.next(user)
                            } else {
                                let tryToLoadUser = false
                                this.cacheUserListReady$.subscribe(cacheUserListReady => {
                                    if (cacheUserListReady) {
                                        this.cacheUserList$.pipe(take(1)).subscribe(cacheUserList => {
                                            const candidateList = cacheUserList.filter(cacheUser => {
                                                return cacheUser._id === id
                                            })
                                            if (candidateList.length) {
                                                observer.next(candidateList[0])
                                            } else if (tryToLoadUser) {
                                                console.log('not found');
                                                // tryToLoadUser = false
                                                observer.next(null)
                                            } else {
                                                tryToLoadUser = true
                                                this.store$.dispatch(cacheActions.putUserByIdCache({ id: id?.toString() || "" }))
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }))
    }

    private getCurrentUserAnnouncementListObserver(user: userModel.IUser): Observable<mainModel.IAnnouncement[]> {
        return new Observable(observer => {
            let loadAnnouncement = 0
            let tryLoad = 0
            this.cacheUserAnnouncementListReady$.subscribe(cacheUserAnnouncementListReady => {
                if (cacheUserAnnouncementListReady) {
                    this.cacheUserAnnouncementList$.pipe(take(1)).subscribe(cacheUserAnnouncementList => {
                        const cacheAnnouncementIdList = cacheUserAnnouncementList.reduce((acc: string[], cur: mainModel.IAnnouncement) => [...acc, cur._id], [])
                        const cacheAnnouncementListFiltered = user.announcementIdList.filter(announcementId => {
                            
                            if (cacheAnnouncementIdList.includes(announcementId)) {
                                return true
                            }
                            (tryLoad < loadAnnouncement || !loadAnnouncement) && this.store$.dispatch(cacheActions.putAnnouncementByIdCache({ id: announcementId }))
                            tryLoad += 1
                            return false
                        })

                        loadAnnouncement = user.announcementIdList.length - cacheAnnouncementListFiltered.length

                        if (cacheAnnouncementListFiltered.length === user.announcementIdList.length) {
                            const candidate = cacheUserAnnouncementList.filter(cacheUserAnnouncement => cacheAnnouncementListFiltered.includes(cacheUserAnnouncement._id))
                            observer.next(candidate)
                        }
                    })
                }
            })
        })
    }
}