import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take, of, takeLast } from 'rxjs';
import * as authorizationModel from '../pages/authorization/models/authorization.model';
import * as authorizationSelectors from '../pages/authorization/reducers/authorization.selectors';
import * as toastActions from '../UI/toasts/reducers/toasts.actions';
import * as toastModel from '../UI/toasts/models/toasts.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store$: Store,
    private router: Router
  ) { }

  isReady$: Observable<boolean> = this.store$.pipe(select(authorizationSelectors.selectUserIsReady))
  isAuth$: Observable<boolean> = this.store$.pipe(select(authorizationSelectors.selectUserIsAuth))

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.isReady$.subscribe(isReady => {
      if (isReady) {
        this.isAuth$.pipe(take(1)).subscribe(isAuth => {
          console.log();
          if (!isAuth) {
            this.store$.dispatch(toastActions.notify({
              toasts: [{
                text: authorizationModel.authorizationGuardEnums.userNotAuthorized,
                type: toastModel.toastTypeEnums.warning
              }]
            }))
          }
        })
      }
    })

    return this.isReadyAndLoginIn$().pipe(takeLast(1))
  }

  isLoginIn$(): Observable<boolean | UrlTree> {
    return new Observable((subscriber) => {
      this.isAuth$.subscribe((status) => {
        if (status) {
          subscriber.next(true);
        } else {
          subscriber.next(false);
        }
        subscriber.complete();
      });
    });
  }

  isReadyAndLoginIn$(): Observable<boolean | UrlTree> {
    return new Observable((subscriber) => {
      this.isReady$.subscribe((readyStatus) => {
        if (readyStatus) {
          this.isLoginIn$().subscribe((loginInStatus) => {
            subscriber.next(loginInStatus);
          })
          subscriber.complete();
        } else {
          subscriber.next(false);
        }
      });
    });
  }

}
