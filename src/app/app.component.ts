import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {RideDialogComponent} from './ride-dialog/ride-dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  idState = 3;
  columnsToDisplay = ['id', 'userName', 'start', 'end', 'date'];

  constructor(private testAppService: TestAppService, private dialog: MatDialog) {}

  ngOnInit() {
    this.ridesData = rides;
  }

  openRideDialog() {
    const dialogRef = this.dialog.open(RideDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      const receivedRideForm = result.value;
      const newRide:Ride = {
        id: this.idState,
        name: receivedRideForm.name,
        startCity: receivedRideForm.startCity,
        startState: receivedRideForm.startState,
        endCity: receivedRideForm.endCity,
        endState: receivedRideForm.endState,
        dateOffered: receivedRideForm.date
      };
      this.ridesData = [...this.ridesData, newRide];
      this.idState++;
    });
  }
}
