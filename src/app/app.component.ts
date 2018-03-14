import { Component, OnInit } from '@angular/core';
import {TestAppService} from './test-app.service';

import {Ride} from './ride/ride';
import {rides} from './ride/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ridesData: Ride[] = [];
  columnsToDisplay = ['id', 'userName', 'start', 'end', 'date'];


  constructor(private testAppService: TestAppService) {}

  ngOnInit() {
    this.ridesData = rides;
  }

  openRideDialog() {
    console.log('hi');
  }
}
