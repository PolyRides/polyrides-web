import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ride} from "../ride/ride";
import {rides} from "../ride/data";
import {MatDialog, MatSnackBar} from "@angular/material";
import {RideDialogComponent} from "../ride-dialog/ride-dialog.component";
import {SessionService} from "../session.service";
import {Subscription} from "rxjs/internal/Subscription";
import {AngularFireDatabase} from "angularfire2/database";
import * as moment from 'moment';
import {map} from "rxjs/operators";


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
  rideOfferSubscription: Subscription;
  profileSubscription: Subscription;
  sessionUserId: string;
  riderOffersDisplayed: any[] = [];
  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(private sessionService: SessionService, private dialog: MatDialog, private snackBar: MatSnackBar,
              private db: AngularFireDatabase) {}

  ngOnInit() {
    this.ridesData = rides;
    this.basicUserSubscription = this.sessionService.basicUserInfo.subscribe(
      (data) => {
        this.sessionUserId = data.uId;
      }
    );

    let rideOffers = this.db.list('/rideOffer', ref => ref.orderByChild('departureDate'));
    this.rideOfferSubscription = rideOffers.snapshotChanges().pipe(
      map(rideOfferChange =>
        rideOfferChange.map(r => ({uId: r.payload.key, ...r.payload.val()}))
      )
    ).subscribe(
      (data) => {
        data.forEach(
          (offer) => {
            if (offer.hasOwnProperty('driverId')) {
              this.processRideOffer(offer);
            }
          }
        );
        console.log(this.riderOffersDisplayed);
      }
    );
  }

  processRideOffer(offer: any) {
    let profiles = this.db.list('/profile', ref => ref.orderByKey().equalTo(offer.driverId));
    this.profileSubscription = profiles.snapshotChanges().pipe(
      map(profileChange =>
        profileChange.map(p => ({ uId: p.payload.key, ...p.payload.val() }))
      )
    ).subscribe(
      (data) => {
        if (data && data.length !== 0) {
          let userProfile: any = data[0];
          let displayedDate = moment.unix(offer.departureDate).format('ddd MMM Do YYYY');
          this.riderOffersDisplayed.push({
            uId: offer.uId,
            driverName: userProfile.firstName + " " + userProfile.lastName,
            departureDate: displayedDate,
            origin: offer.origin,
            originLat: offer.originLat,
            originLon: offer.originLon,
            destination: offer.destination,
            destinationLat: offer.destinationLat,
            destinationLon: offer.destinationLon,
            cost: offer.cost,
            seats: offer.seats
          });
          this.profileSubscription.unsubscribe();
        }
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
      let epochSecs = moment(receivedRideForm.date).unix();
      const newRide = {
        origin: receivedRideForm.origin,
        originLat: receivedRideForm.originLat,
        originLon: receivedRideForm.originLon,
        destination: receivedRideForm.destination,
        destinationLat: receivedRideForm.destinationLat,
        destinationLon: receivedRideForm.destinationLon,
        departureDate: epochSecs,
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
    this.rideOfferSubscription.unsubscribe();
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}
