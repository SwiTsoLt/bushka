import { CommonModule } from "@angular/common";
import { NgModule, LOCALE_ID } from "@angular/core";
import { FormBuilder, FormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { AppRoutingModule } from "../app-routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner"
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

import { AuthorizationModule } from "./authorization/authorization.module";
import { CreateAnnouncementComponent } from "./create-announcement/create-announcement.component";
import { IdeasComponent } from "./ideas/ideas.component";
import { MainComponent } from "./main/main.component";
import { MainService } from "./main/main.service";
import { OtherComponent } from "./other/other.component";
import { PagesComponent } from "./pages.component";
import { ProfileComponent } from "./profile/profile.component";
import { SettingsComponent } from "./settings/settings.component";
import { HttpClientModule } from "@angular/common/http";
import { AnnouncementComponent } from "./main/announcement/announcement.component";
import { LoaderComponent } from "../UI/loader/loader.component";
import { CreateAnnouncementService } from "./create-announcement/create-announcement.service";
import { BrowserModule } from "@angular/platform-browser";
import { SelectOptionsComponent } from "../UI/select-options/select-options.component";
import { CreateAnnouncementStore } from "./create-announcement/create-announcement.store";
import { MatIconModule } from "@angular/material/icon";
import { UserNotFoundComponent } from "./profile/user-not-found/user-not-found.component";
import * as fromCacheReferences from '../store/cache/reducers/index';
import { cacheNode } from "../store/cache/reducers/cache.reducer";
import { CacheEffects } from "../store/cache/cache.effects";
import { EffectsModule } from "@ngrx/effects";
import { UserEffects } from "../store/user/user.effects";
import { userNode } from "../store/user/reducers/user.reducer";
import * as fromUserReferences from "../store/user/reducers";
import { ArticleComponent } from "../UI/article/article.component";
import { UserAnnouncementComponent } from "./user-announcement/user-announcement.component";
import { ProfileStore } from "./profile/profile.store";
import { ToastEffects } from "../UI/toasts/toast.effects";
import { toastsNode } from "../UI/toasts/reducers/toasts.reducer";
import * as fromToastsReferences from "../UI/toasts/reducers";
import { AdminpanelComponent } from './adminpanel/adminpanel.component';

registerLocaleData(localeRu, 'ru');

@NgModule({
    declarations: [
        MainComponent,
        SettingsComponent,
        ProfileComponent,
        IdeasComponent,
        CreateAnnouncementComponent,
        OtherComponent,
        ArticleComponent,
        AnnouncementComponent,
        UserNotFoundComponent,
        UserAnnouncementComponent,
        AdminpanelComponent,
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
        StoreModule.forFeature(userNode, fromUserReferences.reducers.user),
        StoreModule.forFeature(cacheNode, fromCacheReferences.reducers.cache),
        EffectsModule.forFeature([CacheEffects, UserEffects]),
    ],
    providers: [
        MainService,
        CreateAnnouncementService,
        PagesComponent,
        FormBuilder,
        CreateAnnouncementStore,
        ProfileStore,
        {
            provide: LOCALE_ID, useValue: "ru"
        }
    ],
    exports: [
        LoaderComponent,
        ArticleComponent,
        SelectOptionsComponent,
        UserAnnouncementComponent,
    ]
})


export class PagesModule { }