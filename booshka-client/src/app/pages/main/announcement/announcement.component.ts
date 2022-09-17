import { Component, Input, OnInit } from '@angular/core';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import * as announcementModel from '../models/main.model';
import * as userModel from '../../authorization/models/authorization.model';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  constructor(
    private authorizationService: AuthorizationService
  ) { }

  @Input() announcement: announcementModel.IAnnouncement = {
    _id: "",
    title: "",
    description: "",
    price: 0,
    category: {
      _id: "",
      id: 0,
      title: ""
    },
    imageLinkList: [],
    ownerId: "",
    createDate: new Date()
  }

  public owner$: Observable<userModel.IUser> = this.getOwner()

  public getOwner(): Observable<userModel.IUser> {
    return new Observable(observer => {
      this.authorizationService.getUserById(this.announcement.ownerId).subscribe((data: userModel.IAuthorizationHttpResponseGetUser) => {
        if (data.user) {
          observer.next(data.user)
          observer.complete()
        }
        observer.next({
          _id: "",
          gmail: "",
          firstName: "",
          lastName: "",
          phone: "",
          city: "",
          region: ""
        })
        observer.complete()
      })
    })
  }

  ngOnInit(): void {
  }

}
