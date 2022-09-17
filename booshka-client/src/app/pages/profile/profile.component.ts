import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, takeLast, tap, catchError, EMPTY } from 'rxjs';
import { AuthorizationService } from '../authorization/authorization.service';
import * as authorizationModel from '../authorization/models/authorization.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private store$: Store,
    private route: ActivatedRoute,
    private authorizationService: AuthorizationService
  ) { }

  public user$: Observable<authorizationModel.IUser | null> = this.getUserById()
  public userIsReady$: Observable<boolean> = this.getUserIsReady()

  public getUserIsReady(): Observable<boolean> {
    return new Observable(observer => {
      this.user$.pipe(takeLast(1)).subscribe(() => {
        observer.next(true)
        observer.complete()
      })
    })
  }

  public getUserById(): Observable<authorizationModel.IUser | null> {
    return new Observable(observer => {
      this.route.paramMap.subscribe((paramMap: any) => {
        this.authorizationService.getUserById(paramMap.params.id).pipe(
          tap({
            next: (data) => {
              if (data.user) {
                observer.next(data.user)
                return observer.complete()
              }

              observer.next(null)
              return observer.complete()
            },
            error: e => {
              console.log(e);
              observer.next(null)
              return observer.complete()
            }
          }),
          catchError(e => {
            console.log(e);
            return EMPTY
          })
        ).subscribe()
      })
    })
  }

  ngOnInit(): void {
  }

}
