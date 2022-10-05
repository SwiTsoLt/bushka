import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as userActions from '../../store/user/reducers/user.actions';
import * as userModel from '../../store/user/models/user.model';
import * as userSelectors from '../../store/user/reducers/user.selectors';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  constructor(
    private store$: Store
  ) { }

  public user$: Observable<userModel.IUser> = this.store$.pipe(select(userSelectors.selectUser))
  public userReady$: Observable<boolean> = this.store$.pipe(select(userSelectors.selectUserReady))

  public logout() {
    this.store$.dispatch(userActions.logout())
 }

  ngOnInit(): void {
  }

}
