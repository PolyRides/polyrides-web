import { Component, OnInit } from '@angular/core';
import {Ride} from "../ride/ride";
import {rides} from "../ride/data";
import {TestAppService} from "../test-app.service";
import {MatDialog} from "@angular/material";
import {RideDialogComponent} from "../ride-dialog/ride-dialog.component";

@Component({
  selector: 'app-ride-view',
  templateUrl: './ride-view.component.html',
  styleUrls: ['./ride-view.component.css']
})
export class RideViewComponent implements OnInit {

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
      if (result.invalid === undefined || result.invalid) {
        return;
      }
      const receivedRideForm = result.value;
      const newRide: Ride = {
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
