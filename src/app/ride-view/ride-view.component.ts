import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ride} from "../ride/ride";
import {rides} from "../ride/data";
import {MatDialog, MatSnackBar} from "@angular/material";
import {RideDialogComponent} from "../ride-dialog/ride-dialog.component";
import {SessionService} from "../session.service";
import {Subscription} from "rxjs/internal/Subscription";
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-ride-view',
  templateUrl: './ride-view.component.html',
  styleUrls: ['./ride-view.component.css']
})
export class RideViewComponent implements OnInit, OnDestroy {

  ridesData: Ride[] = [];
  idState = 3;
  columnsToDisplay = ['id', 'userName', 'start', 'end', 'date'];
  basicUserSubscription: Subscription;
  sessionUserId: string;

  constructor(private sessionService: SessionService, private dialog: MatDialog, private snackBar: MatSnackBar,
              private db: AngularFireDatabase) {}

  ngOnInit() {
    this.ridesData = rides;
    this.basicUserSubscription = this.sessionService.basicUserInfo.subscribe(
      (data) => {
        this.sessionUserId = data.uId;
      }
    );
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
      const newRide = {
        origin: receivedRideForm.origin,
        originLat: receivedRideForm.originLat,
        originLon: receivedRideForm.originLon,
        destination: receivedRideForm.destination,
        destinationLat: receivedRideForm.destinationLat,
        destinationLon: receivedRideForm.destinationLon,
        departureDate: receivedRideForm.date,
        cost: receivedRideForm.cost,
        seats: receivedRideForm.seats,
        rideDescription: receivedRideForm.rideDescription,
        driverId: this.sessionUserId
      };
      this.db.list("/rideOffer").push(newRide).then(() => {
          console.log("ride posted");
          this.snackBar.open("Ride Posted!", "Success", {
            duration: 2000
          });
        }
      );
    });
  }

  ngOnDestroy() {
    this.basicUserSubscription.unsubscribe();
  }
}
