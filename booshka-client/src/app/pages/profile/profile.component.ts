import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of, take } from 'rxjs';
import { toastTypeEnums } from 'src/app/UI/toasts/models/toasts.model';
import { notify } from 'src/app/UI/toasts/reducers/toasts.actions';
import * as userModel from '../../store/user/models/user.model';
import * as userSelectors from '../../store/user/reducers/user.selectors';
import * as mainModel from '../main/models/main.model';
import * as profileModel from './models/profile.model';
import { ProfileStore } from './profile.store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private store$: Store,
    private route: ActivatedRoute,
    private profileStore: ProfileStore
  ) { }

  public userReady$: Observable<boolean> = this.store$.pipe(select(userSelectors.selectUserReady))
  public user$: Observable<userModel.IUser> = this.store$.pipe(select(userSelectors.selectUser))
  public currentUser$: Observable<userModel.IUser> = this.profileStore.currentUser$
  public currentUserAvatarUrl$: Observable<string> = this.profileStore.currentUserAvatarUrl$
  public currentAnnouncementList$: Observable<mainModel.IAnnouncement[]> = this.profileStore.currentUserAnnouncementList$
  public isOwner$: Observable<boolean> = this.profileStore.currentUserIsOwner$
  public isEdit$: Observable<boolean> = this.profileStore.isEdit$
  public avatarUrl$: Observable<string> = of("")
  public sendButtonIsDisabled$: Observable<boolean> = of(false)
  public isAvatarError$: Observable<boolean> = of(false)

  public fileList: FileList | null = null

  ngOnInit(): void {
    this.userReady$.subscribe(userReady => {
      if (userReady) {
        this.user$.subscribe(user => {
          console.log(user);
          this.profileStore.setCurrentUserSuccess({ user })
          this.currentAnnouncementList$ = this.profileStore.currentUserAnnouncementList$
        })
      }
    })

    this.route.paramMap.subscribe(params => {
      const id = params.get("id") || ""
      this.profileStore.getCurrentUser(id)
      this.profileStore.getCurrentUserAnnouncementList(id)
      this.profileStore.getCurrentUserIsOwner(id)
    })
  }

  public setValue(key: string, value: string) {
    this.profileStore.setValue({ key, value })
  }

  public toggleEdit() {
    this.profileStore.toggleEdit()
  }

  public cancel() {
    this.profileStore.clear()
  }

  public setAvatar(fileList: FileList | null) {
    const file = fileList ? fileList[0] : null
    const fr = new FileReader()
    fr.onload = () => {
      this.avatarUrl$ = of(fr.result?.toString() || "")
    }
    file && fr.readAsDataURL(file)
    this.fileList = fileList
  }

  public send() {
    this.profileStore.send(this.fileList)
    this.sendButtonIsDisabled$ = of(true)
    this.isEdit$.subscribe(isEdit => {
      if (!isEdit) {
        this.avatarUrl$ = of("")
        this.sendButtonIsDisabled$ = of(false)
      }
    })
  }
}
