import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { getAnnouncementCacheList } from 'src/app/store/cache/reducers/cache.actions';
import { selectCacheAnnouncementList } from 'src/app/store/cache/reducers/cache.selectors';
import * as userSelectors from 'src/app/store/user/reducers/user.selectors';
import { IAnnouncement } from '../main/models/main.model';

@Component({
  selector: 'app-user-announcement',
  templateUrl: './user-announcement.component.html',
  styleUrls: ['./user-announcement.component.scss']
})
export class UserAnnouncementComponent implements OnInit {

  constructor(
    private store$: Store,
    private route$: ActivatedRoute
  ) { }

  public user$ = this.store$.pipe(select(userSelectors.selectUser))
  public userReady$ = this.store$.pipe(select(userSelectors.selectUserReady))
  public cacheAnnouncementList$ = this.store$.pipe(select(selectCacheAnnouncementList))
  public userAnnouncementList$ = this.getUserAnnouncementList()

  ngOnInit(): void {
  }

  public getUserAnnouncementList(): Observable<IAnnouncement[]> {
    return new Observable(observer => {
      this.route$.paramMap.subscribe(params => {
        const userId = params.get("id") || ""

        this.userReady$.subscribe(userReady => {
          if (userReady) {
            this.user$.pipe(take(1)).subscribe(user => {
              if (user?._id === userId) {
                user.announcementIdList.forEach(id => {
                  this.cacheAnnouncementList$.subscribe(cacheAnnouncementList => {
                    const candidate = cacheAnnouncementList.filter(cacheAnnouncement => cacheAnnouncement._id === id)
    
                    if (candidate?.length) {
                      observer.next(candidate)
                      observer.complete()
                    }
    
                    this.store$.dispatch(getAnnouncementCacheList())
                  })
                })
              }
            })
          }
        })
      })
    })
  }

}
