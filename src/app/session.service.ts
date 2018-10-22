import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  authState = null;
  _basicUserInfo: BehaviorSubject<basicUserInfo>;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(
      (data) => {
        this.authState = data;
      }
    );
    this._basicUserInfo = new BehaviorSubject<basicUserInfo>({
      uId: "",
      firstName: "",
      lastName: "",
      emailAddress: ""
    });
  }

  get basicUserInfo(): BehaviorSubject<basicUserInfo> {
    return this._basicUserInfo;
  }

  setBasicUserInfo(metadata: basicUserInfo) {
    this._basicUserInfo.next(metadata);
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

export interface basicUserInfo {
  uId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}
