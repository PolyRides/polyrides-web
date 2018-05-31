import {AfterViewInit, Component, ElementRef, Inject, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';



@Component({
  selector: 'app-ride-dialog',
  templateUrl: './ride-dialog.component.html',
  styleUrls: ['./ride-dialog.component.css']
})
export class RideDialogComponent implements OnInit, AfterViewInit {

  rideForm: FormGroup;

  @ViewChild('originGoogle') originRef: ElementRef;
  @ViewChild('destinationGoogle') destinationRef: ElementRef;

  constructor(private dialogRef: MatDialogRef<RideDialogComponent>, private fb: FormBuilder, private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader, @Inject(MAT_DIALOG_DATA) private data: any) {
      this.rideForm = this.fb.group({
        originGoogle: ['', Validators.required],
        origin: ['', Validators.required],
        originLat: ['', Validators.required],
        originLon: ['', Validators.required],
        destinationGoogle: ['', Validators.required],
        destination: ['', Validators.required],
        destinationLat: ['', Validators.required],
        destinationLon: ['', Validators.required],
        date: ['', Validators.required],
        cost: ['', Validators.required],
        seats: ['', Validators.required],
        rideDescription: [' ']
      });
    }

  ngOnInit() {

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
          this.rideForm.get('origin').patchValue(this.splitAddress(place.formatted_address));
          this.rideForm.get('originLat').patchValue(place.geometry.location.lat());
          this.rideForm.get('originLon').patchValue(place.geometry.location.lng());


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
          this.rideForm.get('destination').patchValue(this.splitAddress(place.formatted_address));
          this.rideForm.get('destinationLat').patchValue(place.geometry.location.lat());
          this.rideForm.get('destinationLon').patchValue(place.geometry.location.lng());

        });
      });

    });
  }

  splitAddress(fullAddress: string): string {
    let addressParts = fullAddress.split(",");
    return addressParts[0] + "," + addressParts[1];
  }


  onSubmit() {
  }

}
