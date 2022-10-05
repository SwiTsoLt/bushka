import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "src/app/app-routing.module";
import { AuthorizationComponent } from "./authorization.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { LoginStore } from "./login/login.store";
import { MyButtonComponent } from "src/app/UI/my-button/my-button.component";
import { AuthorizationService } from "./authorization.service";
import { RegistrationStore } from "./registration/registration.store";
import { SelectOptionsComponent } from "src/app/UI/select-options/select-options.component";
import { LoaderComponent } from "src/app/UI/loader/loader.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
    imports: [
        AppRoutingModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        MatProgressSpinnerModule,
    ],
    providers: [
        AuthorizationService,
        LoginStore,
        RegistrationStore
    ],
    declarations: [
        AuthorizationComponent,
        MyButtonComponent,
        LoginComponent,
        RegistrationComponent,
        SelectOptionsComponent,
        LoaderComponent
    ],
    exports: [
        MyButtonComponent,
        SelectOptionsComponent,
        LoaderComponent
    ]
})

export class AuthorizationModule {}