import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';

import {AppRoutingModule} from "./app.routing";

// Google Maps Angular Component Library
import {AgmCoreModule} from '@agm/core';

// AngularFire imports
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from "angularfire2/database";
import {environment} from "../environments/environment";

import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';

// NgDateTime imports
import {OWL_DATE_TIME_FORMATS, OwlDateTimeModule} from 'ng-pick-datetime';
import {OwlMomentDateTimeModule} from 'ng-pick-datetime-moment';

// Component imports
import { AppComponent } from './app.component';
import { RideDialogComponent } from './ride-dialog/ride-dialog.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RideViewComponent } from './ride-view/ride-view.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RequestsComponent } from './requests/requests.component';
import { ProfileComponent } from './profile/profile.component';
import { NoteProfileDialogComponent } from './note-profile-dialog/note-profile-dialog.component';

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  declarations: [
    AppComponent,
    RideDialogComponent,
    HeaderComponent,
    FooterComponent,
    RideViewComponent,
    HomeComponent,
    MainComponent,
    LoginComponent,
    LogoutComponent,
    RequestsComponent,
    ProfileComponent,
    NoteProfileDialogComponent
  ],
  entryComponents: [
    RideDialogComponent,
    NoteProfileDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.gmapsKey,
      libraries: ["places"]
    }),
    AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule, AngularFireDatabaseModule,
    MatTableModule, MatCardModule, MatToolbarModule, MatIconModule, MatSnackBarModule, MatButtonModule, MatDialogModule,
    MatInputModule, MatMomentDateModule,
    MatDatepickerModule, OwlDateTimeModule, OwlMomentDateTimeModule
  ],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
