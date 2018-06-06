import {Component, OnDestroy, OnInit} from '@angular/core';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database';
import { auth } from "firebase/app";
import {SessionService} from "../session.service";
import {Subscription} from "rxjs/index";
import {map} from "rxjs/operators";


@Component({
  selector: 'app-main',
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.css']
})
export class AuthShellComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  profilesSubscription: Subscription;

  constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase, private sessionService: SessionService) {}

  ngOnInit() {
    this.authSubscription = this.afAuth.user.subscribe(
      (data) => {
        if (data) {
          let email = data.email;
          let profiles = this.db.list('/Profile', ref => ref.orderByChild('emailAddress').equalTo(email));
          this.profilesSubscription = profiles.snapshotChanges().pipe(
            map(profileChange =>
              profileChange.map(p => ({ uId: p.payload.key, ...p.payload.val() }))
            )
          ).subscribe(
            (data) => {
              console.log(data);
              if (data && data.length !== 0) {
                let userProfile: any = data[0];
                this.sessionService.setBasicUserInfo({
                  uId: userProfile.uId,
                  firstName: userProfile.firstName,
                  lastName: userProfile.lastName,
                  emailAddress: userProfile.emailAddress
                });
                this.profilesSubscription.unsubscribe();
              }
            }
          );
        }

      }
    );
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    if (this.profilesSubscription) {
      this.profilesSubscription.unsubscribe();
    }
  }

}
