import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as announcementModel from './models/main.model';
import * as cacheActions from "../../store/cache/reducers/cache.actions"
import * as cacheSelectors from '../../store/cache/reducers/cache.selectors';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private store$: Store,
  ) { }

  public announcementList$: Observable<announcementModel.IAnnouncement[]> = this.store$.pipe(select(cacheSelectors.selectCacheAnnouncementList))

  ngOnInit() {
    this.store$.dispatch(cacheActions.getAnnouncementCacheList())
  }

}
