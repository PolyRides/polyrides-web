import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

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


@NgModule({
  declarations: [
    AppComponent,
    RideDialogComponent
  ],
  entryComponents: [
    RideDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule, MatToolbarModule, MatButtonModule, MatDialogModule, MatInputModule, MatNativeDateModule, 
    MatDatepickerModule
  ],
  providers: [
    TestAppService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
