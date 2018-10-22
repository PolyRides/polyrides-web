import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {AngularFireDatabase} from "@angular/fire/database";
import {FormBuilder, FormGroup} from "@angular/forms";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-note-profile-dialog',
  templateUrl: './note-profile-dialog.component.html',
  styleUrls: ['./note-profile-dialog.component.css']
})
export class NoteProfileDialogComponent implements OnInit, OnDestroy {

  rideNoteForm: FormGroup;
  profileId: number;
  name: string;
  email: string;
  profileSubscription: Subscription;

  constructor(private dialogRef: MatDialogRef<NoteProfileDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
              private db: AngularFireDatabase, private fb: FormBuilder) {
    this.rideNoteForm = this.fb.group({
      profileDescription: ['No Description'],
      rideDescription: [data.rideDescription ? data.rideDescription : 'No Description']
    });
    this.name = data.name;
    this.profileId = data.profileId;
  }

  ngOnInit() {
    let profiles = this.db.list('/Profile', ref => ref.orderByKey().equalTo(this.profileId));
    this.profileSubscription = profiles.snapshotChanges().pipe(
      map(profileChange =>
        profileChange.map(p => ({ uId: p.payload.key, ...p.payload.val() }))
      )
    ).subscribe(
      (res) => {
        let profileData: any = res[0];
        this.email = profileData.emailAddress;
        if (profileData.profileDescription) {
          this.rideNoteForm.get('profileDescription').patchValue(profileData.profileDescription);
        }
      }
    );
  }

  ngOnDestroy() {
    this.profileSubscription.unsubscribe();
  }

}
