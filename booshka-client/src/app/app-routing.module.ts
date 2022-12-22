import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatsComponent } from './pages/chats/chats.component';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MainComponent } from './pages/main/main.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/authorization/login/login.component';
import { RegistrationComponent } from './pages/authorization/registration/registration.component';
import { IdeasComponent } from './pages/ideas/ideas.component';
import { CreateAnnouncementComponent } from './pages/create-announcement/create-announcement.component';
import { OtherComponent } from './pages/other/other.component';
import { AuthGuard } from './guards/auth.guard';
import { UserAnnouncementComponent } from './pages/user-announcement/user-announcement.component';
import { AdminpanelComponent } from './pages/adminpanel/adminpanel.component';

export const routes: Routes = [
  { path: "", redirectTo: "/main-component", pathMatch: "full" },
  { path: "", component: MainComponent },
  { path: "main-component", component: MainComponent },
  { path: "main-component/:page", component: MainComponent },
  {
    path: "authorization-component",
    component: AuthorizationComponent,
    children: [
      { path: "login-component", component: LoginComponent },
      { path: "registration-component", component: RegistrationComponent },
      { path: "", redirectTo: "/authorization-component/login-component", pathMatch: "full" }
    ]
  },
  {
    path: "profile-component/:id",
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "profile-component/:id/announcement",
    component: UserAnnouncementComponent,
  },
  {
    path: "profile-component",
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "user-announcement-component",
    component: UserAnnouncementComponent,
    canActivate: [AuthGuard]
  },
  { path: "chats-component", component: ChatsComponent },
  { path: "ideas-component", component: IdeasComponent },
  {
    path: "create-announcement-component",
    component: CreateAnnouncementComponent,
    canActivate: [AuthGuard]
  },
  { path: "chats-component", component: ChatsComponent },
  { path: "other-component", component: OtherComponent },
  { path: "settings-component", component: SettingsComponent },
  { path: "adminpanel-component", component: AdminpanelComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
