import { Component, Input, OnInit } from '@angular/core';
import * as announcementModel from '../models/main.model';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  constructor() { }

  @Input() announcement: announcementModel.IAnnouncement = {
    title: "",
    description: "",
    price: 0,
    ownerId: ""
  }

  ngOnInit(): void {
  }

}
