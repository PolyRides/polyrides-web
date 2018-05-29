import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { auth } from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  authState = null;


  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(
      (data) => {
        this.authState = data;
      }
    );
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user
  get currentUser(): any {
    return this.authenticated ? this.authState.auth : null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  logout() {
    return this.afAuth.auth.signOut();
  }
}
