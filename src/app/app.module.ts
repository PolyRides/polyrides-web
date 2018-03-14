import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';


import { AppComponent } from './app.component';
import { TestAppService } from './test-app.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule, MatToolbarModule, MatButtonModule
  ],
  providers: [TestAppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
