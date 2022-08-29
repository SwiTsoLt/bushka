import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as authorizationModel from '../authorization/models/authorization.model';
import { selectUser, selectUserIsReady } from '../authorization/reducers/authorization.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private store$: Store
  ) { }

  public user$: Observable<authorizationModel.IUser> = this.store$.pipe(select(selectUser))
  public userIsReady$: Observable<boolean> = this.store$.pipe(select(selectUserIsReady))

  ngOnInit(): void {
  }

}
