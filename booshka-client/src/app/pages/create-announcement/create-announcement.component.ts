import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as createAnnouncementModel from "./models/create-announcement-model"
import { CreateAnnouncementStore } from './create-announcement.store';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss']
})
export class CreateAnnouncementComponent implements OnInit, AfterViewInit {

  constructor(
    private createAnnouncementStore: CreateAnnouncementStore
  ) { }

  public createAnnouncementForm$: Observable<createAnnouncementModel.ICreateAnnouncementForm> = this.createAnnouncementStore.form$

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

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    document.dispatchEvent(new Event('textareaInitialization'));
  }

  public setValue(fieldName: string, value: string, element?: any) {
    if (fieldName === 'category') {
      element.querySelectorAll('select')[0].addEventListener('change', (e: any) => {
        const selectId = (+e.target.value-1).toString() || '0'
        this.createAnnouncementStore.setValue({ fieldName, value: selectId })
      })
    } else {
      this.createAnnouncementStore.setValue({ fieldName, value })
    }
  }

  public create() {
    this.createAnnouncementForm$.pipe(take(1)).subscribe(form => this.createAnnouncementStore.create(form))
  }

}
