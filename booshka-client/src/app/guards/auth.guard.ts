import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as authorizationModel from '../pages/authorization/models/authorization.model';
import * as authorizationSelectors from '../pages/authorization/reducers/authorization.selectors';
import * as toastActions from '../UI/toasts/reducers/toasts.actions';
import * as toastModel from '../UI/toasts/models/toasts.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store$: Store
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isAuth$: Observable<boolean> = this.store$.pipe(select(authorizationSelectors.selectUserIsAuth))

    let isAuth: boolean = false

    isAuth$.pipe(take(1)).subscribe(data => isAuth = data)

    if (!isAuth) {
      this.store$.dispatch(toastActions.notify({ toasts: [{
        text: authorizationModel.authorizationGuardEnums.userNotAuthorized,
        type: toastModel.toastTypeEnums.warning
      }] }))
    }

    return isAuth
  }
  
}
