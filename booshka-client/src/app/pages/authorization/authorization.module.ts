import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";

import { AppRoutingModule } from "src/app/app-routing.module";
import * as fromAuthorizationReferences  from "./reducers/index";
import { AuthorizationComponent } from "./authorization.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { loginNode, LoginStore } from "./login/login.store";
import { MyButtonComponent } from "src/app/UI/my-button/my-button.component";
import { AuthorizationService } from "./authorization.service";
import { EffectsModule } from "@ngrx/effects";
import { authorizationNode } from "./reducers/authorization.reducer";
import { RegistrationStore } from "./registration/registration.store";
import { AuthorizationEffects } from "./authorization.effects";

@NgModule({
    imports: [
        AppRoutingModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        EffectsModule.forFeature([AuthorizationEffects]),
        StoreModule.forFeature(authorizationNode, fromAuthorizationReferences.reducers[authorizationNode]),
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
    ],
    exports: [
        MyButtonComponent
    ]
})

export class AuthorizationModule {}