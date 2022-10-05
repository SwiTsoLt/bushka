import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as createAnnouncementModel from "./models/create-announcement-model"
import { CreateAnnouncementStore } from './create-announcement.store';
import { Observable, of, take } from 'rxjs';
import { CreateAnnouncementService } from './create-announcement.service';
import { select, Store } from '@ngrx/store';
import { selectToastList } from 'src/app/UI/toasts/reducers/toasts.selectors';
import * as toastModel from 'src/app/UI/toasts/models/toasts.model';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss']
})
export class CreateAnnouncementComponent implements OnInit, AfterViewInit {

  constructor(
    private store$: Store,
    private createAnnouncementStore: CreateAnnouncementStore,
    private createAnnouncementService: CreateAnnouncementService
  ) { }

  public createIsReady: Observable<boolean> = this.getCreateIsReady()
  public createAnnouncementForm$: Observable<createAnnouncementModel.ICreateAnnouncementStoreForm> = this.createAnnouncementStore.form$
  public categoryList$: Observable<createAnnouncementModel.ICategory[]> = this.getCategoryList()
  public imageList: Observable<File[]> = of([])
  public imageDisplayList: Observable<{ title: string, data: ArrayBuffer | null | string }[]> = of([])

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

  public addImage(el: HTMLInputElement | null) {
    this.imageList.pipe(take(1)).subscribe(currentImageList => {
     
      if (el?.files && el.files[0] && currentImageList.length < 10) {
        
        this.imageList = of([...currentImageList, el.files[0]])
        
        this.imageDisplayList.pipe(take(1)).subscribe(currentImageDisplayList => {
          const reader = new FileReader()
          reader.addEventListener("load", () => {
            if (el?.files && el.files[0]) {
              this.imageDisplayList = of([...currentImageDisplayList, { title: el.files[0].name, data: reader.result }])
            }
          })
          el?.files && el.files[0] && reader.readAsDataURL(el.files[0])
        })

      } else {
        console.log('sthww');
      }
    })
  }

  public removeImage(index: number) {
    this.imageList.pipe(take(1)).subscribe(currentImageList => {
      this.imageList = of([...currentImageList.filter((_, i) => i !== index)])

      this.imageDisplayList.pipe(take(1)).subscribe(currentDisplayImageList => {
        this.imageDisplayList = of([...currentDisplayImageList.filter((_, i) => i !== index)])
      })
    })
  }

  public create() {
    this.createAnnouncementForm$.pipe(take(1)).subscribe(form => {
      this.imageList.pipe(take(1)).subscribe(currentImageList => {
        return this.createAnnouncementStore.create({ ...form, imageList: currentImageList })
      })
    })
  }

  public getCreateIsReady(): Observable<boolean> {
    return new Observable(observer => {
      observer.next(true)
      this.store$.pipe(select(selectToastList)).subscribe(toastList => {
        const candidate = toastList.filter(el => el.type === toastModel.toastTypeEnums.loading)
        if (candidate.length && Object.keys(candidate[0])?.includes('ready')) {
          observer.next(candidate[0].ready)
          candidate[0].ready && observer.complete()
        }
      })
    })
  }

}
