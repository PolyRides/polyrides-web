import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-ride-dialog',
  templateUrl: './ride-dialog.component.html',
  styleUrls: ['./ride-dialog.component.css']
})
export class RideDialogComponent implements OnInit {

  rideForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<RideDialogComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) {
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

  onSubmit() {
  }

}
