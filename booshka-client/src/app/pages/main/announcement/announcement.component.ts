import { Component, Input, OnInit } from '@angular/core';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable, take, takeLast } from 'rxjs';
import * as announcementModel from '../models/main.model';
import * as authorizationModel from '../../authorization/models/authorization.model';
import { select, Store } from '@ngrx/store';
import * as cacheSelectors from 'src/app/cache-reducers/reducers/cache.selectors';
import * as cacheActions from 'src/app/cache-reducers/reducers/cache.actions';

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

  public cacheUserList$: Observable<authorizationModel.IUser[]> = this.store$.pipe(select(cacheSelectors.selectCacheUserList))
  public owner$: Observable<authorizationModel.IUser> = this.getOwner()

  public getOwner(): Observable<authorizationModel.IUser> {
    return new Observable(observer => {
      this.cacheUserList$.subscribe((userList) => {
        const candidate = userList.filter(user => user._id === this.announcement.ownerId)
        observer.next(candidate[0])
        candidate.length && observer.complete()
      })
    })
  }

  ngOnInit(): void {
    this.owner$.pipe(take(1)).subscribe(user => {
      if (!user?._id) {
        this.store$.dispatch(cacheActions.setUserById({ id: this.announcement.ownerId }))
      }
    })
  }

}
