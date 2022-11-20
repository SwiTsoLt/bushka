import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICity, IRegion } from '../../pages/authorization/models/authorization.model';
import * as createAnnouncementModel from '../../pages/create-announcement/models/create-announcement-model';

@Component({
  selector: 'app-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss']
})
export class SelectOptionsComponent implements OnInit, AfterViewInit {

  @Input() categoryList$: Observable<createAnnouncementModel.ICategory[]> = of([])
  @Input() cityList$: Observable<ICity[]> = of([])
  @Input() regionList$: Observable<IRegion[]> = of([])
  @Input() type: string = "category"
  @Input() callback: Function = () => { }

  public resultCategoryList$: Observable<createAnnouncementModel.ICategory[]> = this.getCategoryList$()
  public resultCityList$: Observable<ICity[]> = this.getCityList$()
  public resultRegionList$: Observable<IRegion[]> = this.getRegionList$()

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      document.dispatchEvent(new Event('selectInitialization'));
      this.callback('category', null, document)
    }, 0);
  }

  public getCategoryList$(): Observable<createAnnouncementModel.ICategory[]> {
    return new Observable((subscriber) => {
      this.categoryList$.subscribe(data => {
        if (data.length) {
          subscriber.next(data)
          subscriber.complete()
        }
        subscriber.next([])
      })
    })
  }

  public getCityList$(): Observable<ICity[]> {
    return new Observable(observer => {
      this.cityList$.subscribe(cityList => {
        if (cityList?.length) {
          observer.next(cityList)
          return;
        }
        observer.next([])
        return;
      })
    })
  }

  public getRegionList$(): Observable<IRegion[]> {
    return new Observable(observer => {
      this.regionList$.subscribe(regionList => {
        if (regionList?.length) {
          observer.next(regionList)
          return;
        }
        observer.next([])
        return;
      })
    })
  }

  ngAfterViewInit(): void {
  }

}
