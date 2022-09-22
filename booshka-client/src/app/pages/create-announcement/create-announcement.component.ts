import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as createAnnouncementModel from "./models/create-announcement-model"
import { CreateAnnouncementStore } from './create-announcement.store';
import { Observable, of, take } from 'rxjs';
import { CreateAnnouncementService } from './create-announcement.service';
import { select, Store } from '@ngrx/store';
import { selectToastList } from 'src/app/UI/toasts/reducers/toasts.selectors';
import * as toastModel from 'src/app/UI/toasts/models/toasts.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss']
})
export class CreateAnnouncementComponent implements OnInit, AfterViewInit {

  constructor(
    private store$: Store,
    private router: Router,
    private createAnnouncementStore: CreateAnnouncementStore,
    private createAnnouncementService: CreateAnnouncementService
  ) { }

  public createIsReady: Observable<boolean> = this.getCreateIsReady()
  public createAnnouncementForm$: Observable<createAnnouncementModel.ICreateAnnouncementStoreForm> = this.createAnnouncementStore.form$
  public categoryList$: Observable<createAnnouncementModel.ICategory[]> = this.getCategoryList()
  public imageList: FileList | null = null

  public optionList = [
    {
      groupTitle: "Всё для детей и мам",
      groupOptions: [
        { optionValue: 0, optionTitle: "Одежда до 1 года" },
        { optionValue: 1, optionTitle: "Одежда для девочек" },
        { optionValue: 2, optionTitle: "Одежда для мальчиков" }
      ]
    },
    {
      groupTitle: "Хобби, спорт и туризм",
      groupOptions: [
        { optionValue: 3, optionTitle: "Настольные игры и пазлы" },
        { optionValue: 4, optionTitle: "Спорттовары" },
        { optionValue: 5, optionTitle: "Туристические товары" }
      ]
    }
  ]

  getCategoryList(): Observable<createAnnouncementModel.ICategory[]> {
    return new Observable((subscriber) => {
      this.createAnnouncementService.getCategoryList().subscribe(data => {
        if (data.categoryList) {
          subscriber.next(data.categoryList)
          subscriber.complete()
        }
        subscriber.next([])
      })
    })
  }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    document.dispatchEvent(new Event('textareaInitialization'));
  }

  public setValue(fieldName: string, value: string, element?: any) {
    if (fieldName === 'category') {
      element.querySelectorAll('select')[0].addEventListener('change', (e: any) => {
        const selectId = (+e.target.value - 1).toString() || '0'
        this.createAnnouncementStore.setValue({ fieldName, value: selectId })
      })
    } else {
      this.createAnnouncementStore.setValue({ fieldName, value })
    }
  }

  public setImages(el: HTMLInputElement) {
    this.imageList = el.files
  }

  public create() {
    this.createAnnouncementForm$.pipe(take(1)).subscribe(form => {
      return this.createAnnouncementStore.create({ ...form, imageList: this.imageList })
    })
  }

  public getCreateIsReady(): Observable<boolean> {
    return new Observable(observer => {
      observer.next(true)
      this.store$.pipe(select(selectToastList)).subscribe(toastList => {
        const candidate = toastList.filter(el => el.type === toastModel.toastTypeEnums.loading)
        if (candidate.length && Object.keys(candidate[0])?.includes('ready')) {
          observer.next(candidate[0].ready)
          candidate[0].ready && this.router.navigate(['/'])
          candidate[0].ready && observer.complete()
        }
      })
    })
  }

}
