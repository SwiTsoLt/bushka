import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';

@Component({
  selector: 'app-article-mobile',
  templateUrl: './article-mobile.component.html',
  styleUrls: ['./article-mobile.component.scss']
})
export class ArticleMobileComponent implements OnInit {

  constructor(
    private router: Router,
    private location: Location
  ) { }

  public currentPage: string = "ideas"

  ngOnInit(): void {
    this.router.events.subscribe(val => val instanceof NavigationEnd && (this.currentPage = val.url.replace('/', '').replace('-component', '')))
  }

  changePage() {

  }

}
