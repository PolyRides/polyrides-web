import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {RideViewComponent} from "./ride-view/ride-view.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./auth.guard";
import {MainComponent} from "./main/main.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {RequestsComponent} from "./requests/requests.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'web'
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'loggedout',
    pathMatch: 'full',
    component: LogoutComponent,
  },
  {
    path: 'web',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        pathMatch: 'full',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rides',
        pathMatch: 'full',
        component: RideViewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'requests',
        pathMatch: 'full',
        component: RequestsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        pathMatch: 'full',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})

export class AppRoutingModule { }
