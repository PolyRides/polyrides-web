import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatSnackBar} from "@angular/material";
import {SessionService} from "../session.service";
import {AngularFireDatabase} from "angularfire2/database";
import {RideDialogComponent} from "../ride-dialog/ride-dialog.component";
import * as moment from 'moment';
import {Subscription} from "rxjs";


@Component({
  selector: 'app-detail-rides',
  templateUrl: './detail-rides.component.html',
  styleUrls: ['./detail-rides.component.css']
})
export class DetailRidesComponent implements OnInit, OnDestroy {

  basicUserSubscription: Subscription;
  rideOfferSubscription: Subscription;
  sessionUserId: string = "";
  ridesData = [];
  columnsToDisplay = ['start', 'end', 'departure', 'seats', 'cost'];

  constructor(private sessionService: SessionService, private dialog: MatDialog, private snackBar: MatSnackBar,
              private db: AngularFireDatabase) {}

  ngOnInit() {

    this.basicUserSubscription = this.sessionService.basicUserInfo.subscribe(
      (data) => {
        if (data && data.uId) {
          this.sessionUserId = data.uId;
          let rideOffers = this.db.list('/RideOffer', ref => ref.orderByChild('driverId').equalTo(this.sessionUserId));
          this.rideOfferSubscription = rideOffers.valueChanges().subscribe(
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
                    seats: obj.seats,
                    cost: obj.cost
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

  openRideDialog() {
    const dialogRef = this.dialog.open(RideDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
        isOffer: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.invalid === undefined || result.invalid) {
        return;
      }
      const receivedRideForm = result.value;
      let epochMiliSecs = moment(receivedRideForm.dateTime).valueOf();
      const pushId = this.db.createPushId();
      const newRide = {
        uid: pushId,
        origin: receivedRideForm.origin,
        originLat: receivedRideForm.originLat,
        originLon: receivedRideForm.originLon,
        destination: receivedRideForm.destination,
        destinationLat: receivedRideForm.destinationLat,
        destinationLon: receivedRideForm.destinationLon,
        departureDate: epochMiliSecs,
        cost: receivedRideForm.cost,
        seats: receivedRideForm.seats,
        rideDescription: receivedRideForm.rideDescription,
        driverId: this.sessionUserId
      };
      this.db.list("/RideOffer").set(newRide.uid, newRide).then(() => {
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
    this.rideOfferSubscription.unsubscribe()
  }

}
