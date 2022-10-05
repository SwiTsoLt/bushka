import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take, of, takeLast } from 'rxjs';
import * as authorizationModel from '../pages/authorization/models/authorization.model';
import * as userSelectors from '../store/user/reducers/user.selectors';
import * as toastActions from '../UI/toasts/reducers/toasts.actions';
import * as toastModel from '../UI/toasts/models/toasts.model';
import * as userModel from '../store/user/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store$: Store,
    private router: Router
  ) { }

  user$: Observable<userModel.IUser> = this.store$.pipe(select(userSelectors.selectUser))
  userReady$: Observable<boolean> = this.store$.pipe(select(userSelectors.selectUserReady))

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Observable(observer => {
      this.isLoginIn$().pipe(takeLast(1)).subscribe(isLoginIn => {
        if (!isLoginIn) {
          this.store$.dispatch(toastActions.notify({
            toasts: [{
              text: authorizationModel.authorizationGuardEnums.userNotAuthorized,
              type: toastModel.toastTypeEnums.warning
            }]
          }))
          this.router.navigate(['/'])
        }
        observer.next(isLoginIn)
        observer.complete()
      })
    })
  }

  isLoginIn$(): Observable<boolean | UrlTree> {
    return new Observable((subscriber) => {
      this.userReady$.subscribe(userReady => {
        userReady && this.user$.subscribe((user) => {
          subscriber.next(!!user?._id);
          subscriber.complete();
        });
      })
    });
  }

}
