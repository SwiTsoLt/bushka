import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take, takeLast } from 'rxjs';
import * as loginModel from './models/login.model';
import { LoginStore } from './login.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private store$: Store,
    private loginStore: LoginStore,
    private fb: FormBuilder,
    private router: Router
  ) {

  }

  public loginForm$: Observable<loginModel.ILoginForm> = this.loginStore.form$

  public loginForm: FormGroup<loginModel.ILoginControlForm> = this.fb.nonNullable.group({
    gmail: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]]
  })

  public loginFormErrors: loginModel.ILoginFormErrors = {
    gmail: "",
    password: ""
  }

  ngOnInit(): void {

  }

  public setValue(fieldName: string, value: string) {
    this.loginForm.controls[fieldName as keyof typeof this.loginForm.controls].setValue(value)
    this.loginStore.setValue({ fieldName, value })
  }

  public checkErrors(fieldName: string): void {
    const errors = this.loginForm.controls[fieldName as keyof typeof this.loginForm.controls].errors

    if (errors) {
      switch (Object.keys(errors)[0]) {
        case "required":
          this.loginFormErrors[fieldName] = loginModel.loginFormErrorEnums.required
          break;
        case "minlength":
          this.loginFormErrors[fieldName] = loginModel.loginFormErrorEnums.minLengthPassword
          break;
        case "email":
          this.loginFormErrors[fieldName] = loginModel.loginFormErrorEnums.wrongField
          break;

        default:
          break;
      }
    } else {
      this.loginFormErrors[fieldName] = ""
    }
  }

  public send() {
    this.loginForm$.pipe(take(1)).subscribe(form => this.loginStore.login(form))
  }

}
