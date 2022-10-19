import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon'

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './UI/navbar/navbar.component';
import { ArticleComponent } from './UI/article/article.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogoComponent } from './UI/navbar/logo/logo.component';
import { LogoMobileComponent } from './UI-mobile/navbar-mobile/logo-mobile/logo-mobile.component';
import { MyInputComponent } from './UI/my-input/my-input.component';
import { PagesModule } from './pages/pages.module';
import { AppRoutingModule } from './app-routing.module';
import { PagesComponent } from './pages/pages.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { ToastsComponent } from './UI/toasts/toasts.component';
import * as fromToastReferences from './UI/toasts/reducers/index';
import { NavbarMobileComponent } from './UI-mobile/navbar-mobile/navbar-mobile.component';
import { ArticleMobileComponent } from './UI-mobile/article-mobile/article-mobile.component';
import { LoaderComponent } from './UI/loader/loader.component';
import { SelectOptionsComponent } from './UI/select-options/select-options.component';
import { ToastEffects } from './UI/toasts/toast.effects';
import { CacheEffects } from './store/cache/cache.effects';
import { UserAnnouncementComponent } from './pages/user-announcement/user-announcement.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LogoComponent,
    LogoMobileComponent,
    MyInputComponent,
    PagesComponent,
    ToastsComponent,
    NavbarMobileComponent,
    ArticleMobileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatIconModule,
    PagesModule,
    StoreModule.forRoot(fromToastReferences.reducers),
    StoreDevtoolsModule.instrument({ maxAge: 1000, logOnly: environment.production }),
    EffectsModule.forRoot([ToastEffects, CacheEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    LoaderComponent,
    SelectOptionsComponent,
    ArticleComponent,
    UserAnnouncementComponent
  ]
})
export class AppModule {}
