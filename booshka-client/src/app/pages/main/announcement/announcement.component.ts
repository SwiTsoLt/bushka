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

  public user$: Observable<userModel.IUser> = this.store$.pipe(select(userSelectors.selectUser))
  public userReady$: Observable<boolean> = this.store$.pipe(select(userSelectors.selectUserReady))
  public cacheUserList$: Observable<userModel.IUser[]> = this.store$.pipe(select(cacheSelectors.selectCacheUserList))
  public cacheUserListReady$: Observable<boolean> = this.store$.pipe(select(cacheSelectors.selectCacheUserListReady))
  public owner$: Observable<userModel.IUser> = this.getOwner().pipe(takeLast(1))

  public getOwner(): Observable<userModel.IUser> {
    return new Observable(observer => {
      this.userReady$.subscribe(userReady => {
        if (userReady) {
          this.user$.pipe(take(1)).subscribe(user => {
            if (user._id === this.announcement.ownerId) {
              observer.next(user)
              observer.complete()
            } else {
              this.cacheUserList$.subscribe(cacheList => {
                const candidateIdList: string[] = cacheList.reduce((acc: string[], cur: userModel.IUser) => {
                  return [...acc, cur._id]
                }, [])
                if (candidateIdList.includes(this.announcement.ownerId)) {
                  const candidate = cacheList.filter((userCache) => userCache._id === this.announcement.ownerId)
                  observer.next(candidate[0])
                  observer.complete()
                }
              })
            }
          })
        }
      })
    })
  }

  ngOnInit(): void {
  }

}
