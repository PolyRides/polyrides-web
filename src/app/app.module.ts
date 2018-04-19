import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from "./app.routing";

import {AgmCoreModule} from '@agm/core';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { AppComponent } from './app.component';
import { TestAppService } from './test-app.service';
import { RideDialogComponent } from './ride-dialog/ride-dialog.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RideViewComponent } from './ride-view/ride-view.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    RideDialogComponent,
    HeaderComponent,
    FooterComponent,
    RideViewComponent,
    HomeComponent
  ],
  entryComponents: [
    RideDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBqsd_UNkaH1kRPlXwmfbOKmvJPJETjMBA',
      libraries: ["places"]
    }),
    MatTableModule, MatToolbarModule, MatButtonModule, MatDialogModule, MatInputModule, MatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [
    TestAppService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
