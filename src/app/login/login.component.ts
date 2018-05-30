import {Component, OnDestroy, OnInit} from '@angular/core';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database';
import { auth } from "firebase/app";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  profilesSubscription: Subscription;

  constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {}

  ngOnInit() {

  }

  loginWithFacebook() {
    return this.login(new auth.FacebookAuthProvider());
  }

  loginWithGoogle() {
    return this.login(new auth.GoogleAuthProvider());
  }

  login(provider) {
    this.afAuth.auth.signInWithPopup(provider).then(
      () => {
        this.processSignInSuccess();
      }).catch(
      (err) => {
        console.log(err, "You don't have access!");
      });
  }

  // Check if user exists under "/profile" of db and add if not
  // Could probably update user name by displayName received from auth, in the db
  processSignInSuccess() {
    this.authSubscription = this.afAuth.user.subscribe(
      (data) => {
        console.log("here it is");
        let email = data.email;
        let fullName = data.displayName;
        let nameSplit = fullName.split(" ");
        let firstName = nameSplit[0];
        let lastName = nameSplit[1];
        if (nameSplit.length > 2) {
          lastName += " " + nameSplit[2];
        }

        let profiles = this.db.list('/profile', ref => ref.orderByChild('emailAddress').equalTo(email));
        this.profilesSubscription = profiles.snapshotChanges().pipe(
          map(profileChange =>
            profileChange.map(p => ({ uId: p.payload.key, ...p.payload.val() }))
          )
        ).subscribe(
          (data) => {
            console.log(data);
            if (data === undefined || data.length === 0) {
              console.log("not found");
              this.db.list("/profile").push({
                firstName: firstName,
                lastName: lastName,
                emailAddress: email,
                rating: -1,
                threadIds: [-1],
                deviceToken: -1
              });
            }
            this.router.navigate(["/"]);
          }
        );

      }
    );
  }


  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.profilesSubscription.unsubscribe();
  }

}
