import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as toastModels from './models/toasts.model';
import { selectToastList } from './reducers/toasts.selectors';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent implements OnInit {

  constructor(
    private store$: Store
  ) { }

  public toastList: Observable<toastModels.IToast[]> = this.store$.pipe(select(selectToastList))

  ngOnInit(): void {
  }

}
