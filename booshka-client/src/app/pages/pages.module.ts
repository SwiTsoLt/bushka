import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormBuilder, FormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { AppRoutingModule } from "../app-routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner"

import { AuthorizationModule } from "./authorization/authorization.module";
import * as fromMainReferences from "./main/reducers/index";
import { CreateAnnouncementComponent } from "./create-announcement/create-announcement.component";
import { IdeasComponent } from "./ideas/ideas.component";
import { MainComponent } from "./main/main.component";
import { MainService } from "./main/main.service";
import { OtherComponent } from "./other/other.component";
import { PagesComponent } from "./pages.component";
import { ProfileComponent } from "./profile/profile.component";
import { SettingsComponent } from "./settings/settings.component";
import { announcementNode } from "./main/reducers/main.reducer";
import { HttpClientModule } from "@angular/common/http";
import { AnnouncementComponent } from "./main/announcement/announcement.component";
import { LoaderComponent } from "../UI/loader/loader.component";
import { EffectsModule } from "@ngrx/effects";
import { MainEffects } from "./main/main.effects";
import { CreateAnnouncementService } from "./create-announcement/create-announcement.service";
import { BrowserModule } from "@angular/platform-browser";
import { SelectOptionsComponent } from "../UI/select-options/select-options.component";
import { CreateAnnouncementStore } from "./create-announcement/create-announcement.store";
import {Axios} from "axios"
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    declarations: [
        MainComponent,
        SettingsComponent,
        ProfileComponent,
        IdeasComponent,
        CreateAnnouncementComponent,
        OtherComponent,
        AnnouncementComponent,
        LoaderComponent,
        SelectOptionsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        AuthorizationModule,
        MatProgressSpinnerModule,
        MatIconModule,
        EffectsModule.forFeature([MainEffects]),
        StoreModule.forFeature(announcementNode, fromMainReferences.reducers[announcementNode]),
    ],
    providers: [
        MainService,
        CreateAnnouncementService,
        PagesComponent,
        FormBuilder,
        CreateAnnouncementStore
    ],
    exports: [
        LoaderComponent,
        SelectOptionsComponent,
    ]
})


export class PagesModule { }