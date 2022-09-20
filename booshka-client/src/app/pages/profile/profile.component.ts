import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, takeLast, tap, catchError, EMPTY } from 'rxjs';
import * as cacheSelectors from 'src/app/cache-reducers/reducers/cache.selectors';
import * as cacheActions from 'src/app/cache-reducers/reducers/cache.actions';
import { AuthorizationService } from '../authorization/authorization.service';
import * as authorizationModel from '../authorization/models/authorization.model';
import * as authorizationSelectors from '../authorization/reducers/authorization.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private store$: Store,
    private route: ActivatedRoute,
  ) { }

  public cacheUserList$: Observable<authorizationModel.IUser[]> = this.store$.pipe(select(cacheSelectors.selectCacheUserList))
  public user$: Observable<authorizationModel.IUser | null> = this.getUserById()

  public getUserById(): Observable<authorizationModel.IUser> {
    return new Observable(observer => {
      this.route.paramMap.subscribe((paramMap: any) => {
        if (paramMap.params.id) {
          this.cacheUserList$.subscribe((userList) => {
            const candidate = userList.filter(user => user._id === paramMap.params.id)
            if (candidate) {
              observer.next(candidate[0])
              return observer.complete()
            }
  
            return this.store$.dispatch(cacheActions.setUserById({ id: paramMap.params.id }))
          })
        } else {
          this.store$.pipe(select(authorizationSelectors.selectUser)).subscribe(user => {
            if (user._id) {
              observer.next(user)
              observer.complete()
            }
            
            observer.complete()
          })
        }

      })
    })
  }

  ngOnInit(): void {
  }

}
