import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as cacheActions from 'src/app/store/cache/reducers/cache.actions';
import * as cacheSelectors from '../../store/cache/reducers/cache.selectors';
import * as userSelectors from '../../store/user/reducers/user.selectors';
import { IAnnouncement } from '../main/models/main.model';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {

  constructor(
    private store$: Store,
  ) { }

  public user$ = this.store$.pipe(select(userSelectors.selectUser))
  public userReady$ = this.store$.pipe(select(userSelectors.selectUserReady))
  public cacheAnnouncementListReady$ = this.store$.pipe(select(cacheSelectors.selectCacheAnnouncementListReady))
  public cacheAnnouncementList$ = this.store$.pipe(select(cacheSelectors.selectCacheAnnouncementList))
  public cacheUserList$ = this.store$.pipe(select(cacheSelectors.selectCacheUserList))
  public cacheUserListReady$ = this.store$.pipe(select(cacheSelectors.selectCacheUserListReady))
  public ideas$ = this.getUserIdeaList()

  ngOnInit(): void {
  }

  getUserIdeaList(): Observable<IAnnouncement[]> {
    return new Observable(observer => {
      this.userReady$.subscribe(userReady => {
        if (userReady) {
          this.user$.pipe(take(1)).subscribe(user => {
            this.cacheAnnouncementListReady$.subscribe(cacheAnnouncementListReady => {
              if (cacheAnnouncementListReady) {
                this.cacheAnnouncementList$.pipe(take(1)).subscribe(cacheAnnouncementList => {
                  const candidateList = cacheAnnouncementList.filter(cacheAnnouncement => user.ideas.includes(cacheAnnouncement._id))
                  const candidateIdList = candidateList.reduce((acc: string[], cur) => [...acc, cur._id], [])
                  const announcementIdListToPut = user.ideas.filter(id => !candidateIdList.includes(id))

                  if (!announcementIdListToPut.length) {
                    observer.next(candidateList)
                    observer.complete()

                    // this.cacheUserListReady$.subscribe(cacheUserListReady => {
                    //   if (cacheUserListReady) {
                    //     this.cacheUserList$.pipe(take(1)).subscribe(cacheUserList => {
                    //       const cacheUserIdList = cacheUserList.reduce((acc: string[], cur) => [...acc, cur._id], [])

                    //       console.log('l: ', cacheUserIdList);

                    //       if (user._id !== candidateList[candidateList.length - 1].ownerId && !cacheUserIdList.includes(candidateList[candidateList.length - 1].ownerId)) {
                    //         this.store$.dispatch(cacheActions.putUserByIdCache({ id: candidateList[candidateList.length - 1].ownerId }))
                    //       }
                    //     })
                    //   }
                    // })
                  } else {
                    observer.next(candidateList)
                    this.store$.dispatch(cacheActions.putAnnouncementByIdCache({ id: announcementIdListToPut[announcementIdListToPut.length - 1] }))
                  }
                })
              }
            })
          })
        }
      })
    })
  }

}
