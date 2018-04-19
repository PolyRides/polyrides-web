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

  @ViewChild('origin') originRef: ElementRef;
  @ViewChild('destination') destinationRef: ElementRef;

  constructor(private dialogRef: MatDialogRef<RideDialogComponent>, private fb: FormBuilder, private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader, @Inject(MAT_DIALOG_DATA) private data: any) {
      this.rideForm = this.fb.group({
        name: ['', Validators.required],
        startCity: ['', Validators.required],
        startState: ['', Validators.required],
        endCity: ['', Validators.required],
        endState: ['', Validators.required],
        date: ['', Validators.required]
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
          this.rideForm.get('startCity').patchValue(place.formatted_address);

          //set latitude, longitude and zoom
          // this.latitude = place.geometry.location.lat();
          // this.longitude = place.geometry.location.lng();
          // this.zoom = 12;
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
          this.rideForm.get('endCity').patchValue(place.formatted_address);

          //set latitude, longitude and zoom
          // this.latitude = place.geometry.location.lat();
          // this.longitude = place.geometry.location.lng();
          // this.zoom = 12;
        });
      });

    });
  }


  onSubmit() {
  }

}
