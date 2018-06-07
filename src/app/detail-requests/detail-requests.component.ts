import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {MatDialog, MatSnackBar} from "@angular/material";
import {RideDialogComponent} from "../ride-dialog/ride-dialog.component";
import {SessionService} from "../session.service";
import * as moment from 'moment';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-detail-requests',
  templateUrl: './detail-requests.component.html',
  styleUrls: ['./detail-requests.component.css']
})
export class DetailRequestsComponent implements OnInit, OnDestroy {

  basicUserSubscription: Subscription;
  rideRequestSubscription: Subscription;
  sessionUserId: string = "";
  ridesData = [];
  columnsToDisplay = ['start', 'end', 'departure'];

  constructor(private sessionService: SessionService, private dialog: MatDialog, private snackBar: MatSnackBar,
              private db: AngularFireDatabase) {}

  ngOnInit() {

    this.basicUserSubscription = this.sessionService.basicUserInfo.subscribe(
      (data) => {
        if (data && data.uId) {
          this.sessionUserId = data.uId;
          let rideRequests = this.db.list('/RideRequest', ref => ref.orderByChild('riderId').equalTo(this.sessionUserId));
          this.rideRequestSubscription = rideRequests.valueChanges().subscribe(
            (offer) => {
              let tempRides = [];
              console.log(offer);
              offer.forEach(
                (obj: any) => {
                  let displayedDeparture = moment(obj.departureDate).format('ddd MMM Do YYYY h:mm a');
                  let rideOffer = {
                    uid: obj.uid,
                    origin: obj.origin,
                    destination: obj.destination,
                    departureDate: displayedDeparture,
                  };
                  tempRides.push(rideOffer);
                }
              );
              this.ridesData = [...tempRides];
              tempRides = [];
            }
          );
        }
      }
    );
  }

  openRequestDialog() {
    const dialogRef = this.dialog.open(RideDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
        isOffer: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.invalid === undefined || result.invalid) {
        return;
      }
      const receivedRideForm = result.value;
      let epochMiliSecs = moment(receivedRideForm.dateTime).valueOf();
      const pushId = this.db.createPushId();
      const newRideRequest = {
        uid: pushId,
        origin: receivedRideForm.origin,
        originLat: receivedRideForm.originLat,
        originLon: receivedRideForm.originLon,
        destination: receivedRideForm.destination,
        destinationLat: receivedRideForm.destinationLat,
        destinationLon: receivedRideForm.destinationLon,
        departureDate: epochMiliSecs,
        rideDescription: receivedRideForm.rideDescription,
        riderId: this.sessionUserId
      };
      this.db.list("/RideRequest").set(newRideRequest.uid, newRideRequest).then(() => {
          console.log("ride posted");
          this.snackBar.open("Ride Requested!", "Success", {
            duration: 2000
          });
        }
      );
    });
  }

  ngOnDestroy() {
    this.basicUserSubscription.unsubscribe();
    this.rideRequestSubscription.unsubscribe()
  }

}
