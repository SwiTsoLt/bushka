import { Component, Input, OnInit } from '@angular/core';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable, take, takeLast } from 'rxjs';
import * as userModel from '../../../store/user/models/user.model';
import * as announcementModel from '../models/main.model';
import { select, Store } from '@ngrx/store';
import * as cacheSelectors from '../../../store/cache/reducers/cache.selectors';
import * as userSelectors from '../../../store/user/reducers/user.selectors';
import * as userActions from '../../../store/user/reducers/user.actions';
import * as cacheActions from 'src/app/store/cache/reducers/cache.actions';
import { notify } from 'src/app/UI/toasts/reducers/toasts.actions';
import { toastTypeEnums } from 'src/app/UI/toasts/models/toasts.model';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  constructor(
    private store$: Store,
    private authorizationService: AuthorizationService
  ) { }

  @Input() announcement: announcementModel.IAnnouncement = {
    _id: "",
    title: "",
    description: "",
    price: 0,
    category: {
      _id: "",
      id: 0,
      title: ""
    },
    imageLinkList: [],
    ownerId: "",
    createDate: new Date()
  }

  public userReady$: Observable<boolean> = this.store$.pipe(select(userSelectors.selectUserReady))
  public user$: Observable<userModel.IUser> = this.store$.pipe(select(userSelectors.selectUser))
  public announcementInIdea$: Observable<boolean> = this.announcementInIdea()

  public announcementInIdea(): Observable<boolean> {
    return new Observable(observer => {
      this.userReady$.subscribe(userReady => {
        if (userReady) {
          this.user$.pipe(take(1)).subscribe(user => {
            observer.next(user.ideas.includes(this.announcement._id))
          })
        }
      })
    })
  }

  public putIdea(id: string, event: any) {
    event.target.classList.add('click')
    console.log(event.target.classList);
    setTimeout(() => event.target.classList.remove('click'), 400)
    this.store$.dispatch(userActions.toggleIdea({ id }))
  }

  public details() {
    this.store$.dispatch(notify({ toasts: [{ text: "Упс... Ещё в разработке.", type: toastTypeEnums.notify }] }))
  }

  ngOnInit(): void {
  }

}
