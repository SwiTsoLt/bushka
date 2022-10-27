import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as cacheActions from '../../store/cache/reducers/cache.actions';
import * as cacheSelectors from 'src/app/store/cache/reducers/cache.selectors';
import * as userSelectors from '../../store/user/reducers/user.selectors';
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
  public cacheAnnouncementListReady$ = this.store$.pipe(select(cacheSelectors.selectCacheAnnouncementListReady))
  public cacheAnnouncementList$ = this.store$.pipe(select(cacheSelectors.selectCacheAnnouncementList))
  public cacheUserList$ = this.store$.pipe(select(cacheSelectors.selectCacheUserList))
  public cacheUserListReady$ = this.store$.pipe(select(cacheSelectors.selectCacheUserListReady))
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
                this.cacheAnnouncementListReady$.subscribe(cacheAnnouncementListReady => {
                  if (cacheAnnouncementListReady) {
                    this.cacheAnnouncementList$.pipe(take(1)).subscribe(cacheAnnouncementList => {
                      const candidateCacheAnnouncementList = user.announcementIdList.reduce((acc: IAnnouncement[], cur) => {
                        const candidateAnnouncementList = cacheAnnouncementList.filter((cacheAnnouncement) => cacheAnnouncement._id === cur)
                        return [...acc, ...candidateAnnouncementList]
                      }, [])

                      const candidateCacheAnnouncementIdList = candidateCacheAnnouncementList.reduce((acc: string[], cur: IAnnouncement) => [...acc, cur._id], [])

                      const announcementToPut = user.announcementIdList.filter(id => !candidateCacheAnnouncementIdList.includes(id))

                      if (announcementToPut.length) {
                        this.store$.dispatch(cacheActions.putAnnouncementByIdCache({ id: announcementToPut[announcementToPut.length - 1] }))
                      } else {
                        if (candidateCacheAnnouncementList?.length === user?.announcementIdList?.length) {
                          observer.next(candidateCacheAnnouncementList)
                        } else {
                          this.store$.dispatch(cacheActions.getAnnouncementCacheList())
                        }
                      }
                    })
                  }
                })
              } else {
                this.cacheUserListReady$.subscribe(cacheUserListReady => {
                  if (cacheUserListReady) {
                    this.cacheUserList$.pipe(take(1)).subscribe(cacheUserList => {
                      const candidateCacheUserList = cacheUserList.filter(cacheUser => cacheUser._id === userId)

                      if (candidateCacheUserList?.length) {
                        this.cacheAnnouncementListReady$.subscribe(cacheAnnouncementListReady => {
                          if (cacheAnnouncementListReady) {
                            this.cacheAnnouncementList$.pipe(take(1)).subscribe(cacheAnnouncementList => {
                              const candidateCacheAnnouncementList = candidateCacheUserList[0].announcementIdList.reduce((acc: any, cur) => {
                                const candidateAnnouncementList = cacheAnnouncementList.filter(cacheAnnouncement => cacheAnnouncement._id === cur)
                                return [...acc, ...candidateAnnouncementList]
                              }, [])

                              if (candidateCacheAnnouncementList?.length === candidateCacheUserList[0].announcementIdList?.length) {
                                observer.next(candidateCacheAnnouncementList)
                              } else {
                                this.store$.dispatch(cacheActions.getAnnouncementCacheList())
                              }
                            })
                          }
                        })
                      }
                    })
                  } else {
                    this.store$.dispatch(cacheActions.getUserCacheList())
                  }
                })
              }
            })
          }
        })
      })
    })
  }
}