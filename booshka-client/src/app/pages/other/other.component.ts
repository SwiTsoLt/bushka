import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as userModel from 'src/app/store/user/models/user.model';
import * as userSelectors from 'src/app/store/user/reducers/user.selectors';

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

  public user$: Observable<userModel.IUser> = this.store$.pipe(select(userSelectors.selectUser))
  public userId$: Observable<string> = this.getUserId()
  public userIsReady$: Observable<boolean> = this.store$.pipe(select(userSelectors.selectUserReady))

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

  public onRegistration() {
    return this.router.navigate(['/authorization-component/login-component'])
  }

  ngOnInit(): void {
  }

}
