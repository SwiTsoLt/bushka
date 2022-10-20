import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as cacheSelectors from 'src/app/store/cache/reducers/cache.selectors';
import * as cacheActions from 'src/app/store/cache/reducers/cache.actions';
import * as userModel from 'src/app/store/user/models/user.model';
import * as userSelectors from 'src/app/store/user/reducers/user.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private store$: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  public cacheUserList$: Observable<userModel.IUser[]> = this.store$.pipe(select(cacheSelectors.selectCacheUserList))
  public user$: Observable<userModel.IUser> = this.store$.pipe(select(userSelectors.selectUser))
  public currentUser$: Observable<userModel.IUser> = this.getCurrentUser()

  public getCurrentUser(): Observable<userModel.IUser> {
    return new Observable(observer => {
      this.route.params.subscribe(params => {
        this.user$.pipe(take(1)).subscribe(user => {
          const id = params['id'] || ""

          if (id.trim()) {
            if (id === user._id) {
              observer.next(user)
              return;
            }

            this.cacheUserList$.subscribe(cacheUserList => {
              const candidate = cacheUserList.filter(cacheUser => cacheUser._id === id)

              if (candidate.length) {
                observer.next(candidate[0])
              } else {
                this.store$.dispatch(cacheActions.putUserByIdCache({ id }))
              }
            })

            return;
          }

          this.router.navigate([`/profile-component/${user?._id}`])
          return;
        })
      })
    })
  }

  ngOnInit(): void {
  }

}
