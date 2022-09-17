import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as announcementModel from './models/main.model';
import * as announcementActions from "./reducers/main.actions"
import * as announcementSelectors from './reducers/main.selectors';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private store$: Store,
  ) { }

  public announcementList$: Observable<announcementModel.IAnnouncement[]> = this.store$.pipe(select(announcementSelectors.selectAnnouncementList))
  public isReady$: Observable<boolean> = this.store$.pipe(select(announcementSelectors.selectAnnouncementIsReady))

  ngOnInit() {
    this.announcementList$.pipe(take(1)).subscribe(data => {
      if (!data.length) {
        this.store$.dispatch(announcementActions.setAnnouncementList())
      }
    })
  }

}
