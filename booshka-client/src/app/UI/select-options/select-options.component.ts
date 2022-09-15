import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as createAnnouncementModel from 'src/app/pages/create-announcement/models/create-announcement-model';

@Component({
  selector: 'app-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss']
})
export class SelectOptionsComponent implements OnInit, AfterViewInit {

  @Input() categoryList$: Observable<createAnnouncementModel.ICategory[]> = of([])
  @Input() callback: Function = () => { }

  public resultCategoryList$: Observable<createAnnouncementModel.ICategory[]> = this.getCategoryList$()

  constructor() { }

  ngOnInit(): void {
  }

  getCategoryList$(): Observable<createAnnouncementModel.ICategory[]> {
    return new Observable((subscriber) => {
      this.categoryList$.subscribe(data => {
        if (data.length) {
          subscriber.next(data)
          subscriber.complete()

          setTimeout(() => {
            document.dispatchEvent(new Event('selectInitialization'));
            this.callback('category', null, document)
          }, 0);
        }
        subscriber.next([])
      })
    })
  }

  ngAfterViewInit(): void {
  }

}
