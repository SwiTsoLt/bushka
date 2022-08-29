import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthorizationModule from '../authorization/models/authorization.model';
import * as authorizationSelectors from '../authorization/reducers/authorization.selectors';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  constructor(
    private router: Router,
    private store$: Store
  ) { }

  public user$: Observable<AuthorizationModule.IUser> = this.store$.pipe(select(authorizationSelectors.selectUser))
  public userIsReady$: Observable<boolean> = this.store$.pipe(select(authorizationSelectors.selectUserIsReady))

  ngOnInit(): void {
  }

  public onRegistration() {
    return this.router.navigate(['/authorization-component/login-component'])
  }

}
