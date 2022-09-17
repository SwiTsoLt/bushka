import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as authorizationModel from 'src/app/pages/authorization/models/authorization.model';
import * as authorizationSelectors from 'src/app/pages/authorization/reducers/authorization.selectors';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  constructor(
    private store$: Store
  ) { }

  public user$: Observable<authorizationModel.IUser> = this.store$.pipe(select(authorizationSelectors.selectUser))
  public userId$: Observable<string> = this.getUserId()
  public userIsReady$: Observable<boolean> = this.store$.pipe(select(authorizationSelectors.selectUserIsReady))

  public getUserId(): Observable<string> {
    return new Observable(observer => {
      this.userIsReady$.subscribe(userIsReady => {
        if (userIsReady) {
          this.user$.pipe(take(1)).subscribe(user => {
            observer.next(user._id)
            observer.complete()
          }).unsubscribe()
        }
      })
    })
  }

  ngOnInit(): void {
  }

}
