import {AfterViewInit, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MapsAPILoader } from '@agm/core';
import {Subscription} from "rxjs";
import * as moment from 'moment';
import {Moment} from "moment";

const offerHeader = "Offer a Ride";
const requestHeader = "Request a Ride";

@Component({
  selector: 'app-ride-dialog',
  templateUrl: './ride-dialog.component.html',
  styleUrls: ['./ride-dialog.component.css']
})
export class RideDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  rideForm: FormGroup;

  @ViewChild('origin') originRef: ElementRef;
  @ViewChild('destination') destinationRef: ElementRef;
  originSubscription: Subscription;
  destinationSubscription: Subscription;
  minDateTime: Moment;
  isOffer: boolean;
  headerText: string;

  constructor(private dialogRef: MatDialogRef<RideDialogComponent>, private fb: FormBuilder, private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader, @Inject(MAT_DIALOG_DATA) private data: any) {
      this.minDateTime = moment().add(15, 'm');
      this.rideForm = this.fb.group({
        originGoogle: ['', Validators.required],
        origin: ['', Validators.required],
        originLat: ['', Validators.required],
        originLon: ['', Validators.required],
        destinationGoogle: ['', Validators.required],
        destination: ['', Validators.required],
        destinationLat: ['', Validators.required],
        destinationLon: ['', Validators.required],
        dateTime: ['', Validators.required],
        cost: ['', Validators.required],
        seats: ['', Validators.required],
        rideDescription: ['']
      });
      if (data) {
        if (data.isOffer == true) {
          this.isOffer = true;
          this.headerText = offerHeader;
        }
        else {
          this.isOffer = false;
          this.headerText = requestHeader;
          // disable inputs by putting dummy values
          this.rideForm.get('cost').patchValue("-1");
          this.rideForm.get('seats').patchValue("-1");
        }
      }
    }

  ngOnInit() {
    this.originSubscription = this.rideForm.get('origin').valueChanges.subscribe(
      (value) => {
        if (this.rideForm.get('originGoogle').value != value) {
          this.rideForm.get('originLat').reset();
          this.rideForm.get('originLon').reset();
        }
      }
    );

    this.destinationSubscription = this.rideForm.get('destination').valueChanges.subscribe(
      (value) => {
        if (this.rideForm.get('destinationGoogle').value != value) {
          this.rideForm.get('destinationLat').reset();
          this.rideForm.get('destinationLon').reset();
        }
      }
    );

  }

  ngAfterViewInit() {
    this.mapsAPILoader.load().then(() => {
      let originAutocomplete = new google.maps.places.Autocomplete(this.originRef.nativeElement, {
        types: ['(cities)'],
        componentRestrictions: {country: 'us'},
      });

      let destinationAutocomplete = new google.maps.places.Autocomplete(this.destinationRef.nativeElement, {
        types: ['(cities)'],
        componentRestrictions: {country: 'us'},
      });
      originAutocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = originAutocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          console.log(place);
          console.log(place.geometry.location.lat());
          console.log(place.geometry.location.lng());

          // TO DO formatted_address is not given a guranteed format by Google Place API
          this.rideForm.get('originGoogle').patchValue(place.formatted_address);
          this.rideForm.get('originLat').patchValue(place.geometry.location.lat());
          this.rideForm.get('originLon').patchValue(place.geometry.location.lng());
          this.rideForm.get('origin').patchValue(place.formatted_address);

        });
      });

      destinationAutocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = destinationAutocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          console.log(place);
          console.log(place.geometry.location.lat());
          console.log(place.geometry.location.lng());

          // TO DO formatted_address is not given a guranteed format by Google Place API
          this.rideForm.get('destinationGoogle').patchValue(place.formatted_address);
          this.rideForm.get('destinationLat').patchValue(place.geometry.location.lat());
          this.rideForm.get('destinationLon').patchValue(place.geometry.location.lng());
          this.rideForm.get('destination').patchValue(place.formatted_address);

        });
      });

    });
  }


  onSubmit() {
  }

  ngOnDestroy() {
    this.originSubscription.unsubscribe();
    this.destinationSubscription.unsubscribe();
  }

}
