import { Component, OnInit } from '@angular/core';
import { AngularFireAuth} from "angularfire2/auth";
import { auth } from "firebase/app";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private router: Router) {}

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
        console.log(this.afAuth.user);
        this.router.navigate(["/"]);
      }).catch(
      (err) => {
        console.log(err, "You don't have access!");
      });
  }

}
