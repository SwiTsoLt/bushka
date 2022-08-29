import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { localStorageNameNode } from './pages/authorization/login/login.store';
import * as authorizationActions from './pages/authorization/reducers/authorization.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent implements OnInit {

  constructor(
    private store$: Store
  ) {}
  
  ngOnInit(): void {
    const token = JSON.parse(localStorage.getItem(localStorageNameNode) || "{}")?.token
    this.store$.dispatch(authorizationActions.getAndSetUserByJWT({ token }))
  }
}
