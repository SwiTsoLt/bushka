import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as toastActions from 'src/app/UI/toasts/reducers/toasts.actions';
import * as toastsModel from 'src/app/UI/toasts/models/toasts.model';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  public linksOutline: string = ""

  constructor(
    private router: Router,
    private store$: Store
  ) { }

  ngOnInit(): void {
    const currentPage = this.router.url.split('/')[this.router.url.split('/').length - 1]

    if (currentPage === 'login-component') {
      this.linksOutline = 'left'
    }
    else if (currentPage === 'registration-component') {
      this.linksOutline = 'right'
    }
  }

  public toggleLinksOutline(v: string) {
    this.linksOutline = v
  }

}
