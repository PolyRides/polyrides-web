import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {RideViewComponent} from "./ride-view/ride-view.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./auth.guard";
import {AuthShellComponent} from "./auth-shell/auth-shell.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {RequestsComponent} from "./requests/requests.component";
import {ProfileComponent} from "./profile/profile.component";
import {MainShellComponent} from "./main-shell/main-shell.component";
import {SearchShellComponent} from "./search-shell/search-shell.component";
import {DetailRidesComponent} from "./detail-rides/detail-rides.component";
import {DetailRequestsComponent} from "./detail-requests/detail-requests.component";
import {AllRidesComponent} from "./all-rides/all-rides.component";

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
    component: AuthShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'main'
      },
      {
        path: 'main',
        component: MainShellComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'rides'
          },
          {
            path: 'rides',
            pathMatch: 'full',
            component: DetailRidesComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'requests',
            pathMatch: 'full',
            component: DetailRequestsComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'all',
            pathMatch: 'full',
            component: AllRidesComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'search',
        component: SearchShellComponent,
        canActivate: [AuthGuard],
        children: [

        ]
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
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'web'
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})

export class AppRoutingModule { }
