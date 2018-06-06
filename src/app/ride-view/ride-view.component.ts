import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ride} from "../ride/ride";
import {rides} from "../ride/data";
import {MatDialog, MatSnackBar} from "@angular/material";
import {RideDialogComponent} from "../ride-dialog/ride-dialog.component";
import {SessionService} from "../session.service";
import {Subscription} from "rxjs/internal/Subscription";
import {AngularFireDatabase} from "angularfire2/database";
import * as moment from 'moment';
import {map, take} from "rxjs/operators";
import LatLngBounds = google.maps.LatLngBounds;
import {NoteProfileDialogComponent} from "../note-profile-dialog/note-profile-dialog.component";

const centerLat: number = 37.0902;
const centerLon: number = -95.7129;

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
  originLat: number = centerLat;
  originLon: number = centerLon;
  destLat: number = centerLat;
  destLon: number = centerLon;
  mapBounds: any;

  constructor(private sessionService: SessionService, private dialog: MatDialog, private snackBar: MatSnackBar,
              private db: AngularFireDatabase) {}

  ngOnInit() {
    this.ridesData = rides;
    this.basicUserSubscription = this.sessionService.basicUserInfo.subscribe(
      (data) => {
        this.sessionUserId = data.uId;
      }
    );

    let rideOffers = this.db.list('/RideOffer', ref => ref.orderByChild('departureDate'));
    this.rideOfferSubscription = rideOffers.snapshotChanges().pipe(
      map(rideOfferChange =>
        rideOfferChange.map(r => ({uId: r.payload.key, ...r.payload.val()}))
      )
    ).subscribe(
      (data) => {
        let promiseArray = [];
        data.forEach(
          (offer) => {
            if (offer.hasOwnProperty('driverId')) {
              promiseArray.push(this.processRideOffer(offer));
            }
          }
        );
        console.log("done with foreach");
        Promise.all(promiseArray).then(
          (values) => {
            console.log("done with all promises");
            console.log(values);
            this.riderOffersDisplayed = [...values];
            console.log("displayed ...");
            console.log(this.riderOffersDisplayed);
            this.snackBar.open("Rides Loaded!", "Success", {
              duration: 2000
            });
          });
      }
    );
  }

  processRideOffer(offer: any) {
    let promise = new Promise((resolve, reject) => {
      let profiles = this.db.list('/Profile', ref => ref.orderByKey().equalTo(offer.driverId));
      profiles.snapshotChanges().pipe(
        map(profileChange =>
          profileChange.map(p => ({ uId: p.payload.key, ...p.payload.val() }))
        )
      ).pipe(take(1)).toPromise().then(
        (data) => {
          if (data && data.length !== 0) {
            let userProfile: any = data[0];
            let displayedDate = moment(offer.departureDate).format('ddd MMM Do YYYY');
            let displayedTime = moment(offer.departureDate).format('h:mm a');
            resolve({
              uId: offer.uId,
              profileId: userProfile.uId,
              driverName: userProfile.firstName + " " + userProfile.lastName,
              departureDate: displayedDate,
              displayedTime: displayedTime,
              origin: offer.origin,
              originLat: offer.originLat,
              originLon: offer.originLon,
              destination: offer.destination,
              destinationLat: offer.destinationLat,
              destinationLon: offer.destinationLon,
              cost: offer.cost,
              seats: offer.seats,
              rideDescription: offer.rideDescription
            });
          }
        }
      ).catch((err) => {
        console.log(err);
        reject();
      })
    });
    return promise;
  }

  updateMapView(obj) {
    this.originLat = obj ? obj.originLat : this.originLat;
    this.originLon = obj ? obj.originLon : this.originLon;
    this.destLat = obj ? obj.destinationLat : this.destLat;
    this.destLon = obj ? obj.destinationLon : this.destLon;
    let bounds:LatLngBounds = new google.maps.LatLngBounds();

    bounds.extend(new google.maps.LatLng(this.originLat, this.originLon));
    bounds.extend(new google.maps.LatLng(this.destLat, this.destLon));
    this.mapBounds = bounds;
  }

  trackRideOffersDisplayed(index, obj) {
    return obj ? obj.uId : undefined;
  }

  openProfileDialog(obj) {
    const dialogRef = this.dialog.open(NoteProfileDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
        rideDescription: obj.rideDescription,
        name: obj.driverName,
        profileId: obj.profileId
      }
    });
  }

  requestRide(obj) {
    if (!obj.seats || (obj.seats && obj.seats <= 0) || (obj.profileId === this.sessionUserId)) {
      this.snackBar.open("Cannot request this ride!", "Error", {
        duration: 2000
      });
      return;
    }
    let rideOffers = this.db.list('/RideOffer', ref => ref.orderByKey().equalTo(obj.uId));
    let requestRideOfferSubscription = rideOffers.snapshotChanges().pipe(
      map(rideOffer =>
        rideOffer.map(p => ({ uId: p.payload.key, ...p.payload.val() }))
      )
    ).subscribe(
      (data) => {
        console.log(data);
        if (data && data.length !== 0) {
          let offer: any = data[0];
          let occupiedSeats = obj.seats - 1;
          if (offer.hasOwnProperty('riderIds')) {
            let exisitingRiderIds = offer.riderIds;
            let found = false;
            for (let id of exisitingRiderIds) {
              if (id === this.sessionUserId) {
                found = true;
              }
            }
            console.log("found is " + found);
            if (found) {
              this.snackBar.open("You are part of this ride!", "Error", {
                duration: 2000
              });
            }
            else {
              rideOffers.update(obj.uId, {
                riderIds: [this.sessionUserId, ...exisitingRiderIds],
                seats: occupiedSeats
              }).then(
                () => {
                  this.snackBar.open("Ride Requested!", "Success", {
                    duration: 2000
                  });
                }
              );
            }
          }
          else {
            rideOffers.update(obj.uId, {
              riderIds: [this.sessionUserId],
              seats: occupiedSeats
            }).then(
              () => {
                this.snackBar.open("Ride Requested!", "Success", {
                  duration: 2000
                });
              }
            );
          }
          requestRideOfferSubscription.unsubscribe();
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
    this.rideOfferSubscription.unsubscribe();
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}
