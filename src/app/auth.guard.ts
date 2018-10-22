import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import {SessionService} from "./session.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  authenticationSubscription: Subscription;

  constructor(private sessionService: SessionService, private router: Router, public afAuth: AngularFireAuth) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const authStateObservable = Observable.create(
      (observer) => {
        this.authenticationSubscription = this.afAuth.authState.subscribe(
          (data) => {
            if (data) {
              this.cleanUp(true, observer);
            }
            else {
              this.cleanUp(false, observer);
            }
          },
          (err) => {
            console.log(err);
            this.cleanUp(false, observer);
          }
        );
      }
    );

    return authStateObservable;
  }

  cleanUp(result: boolean, observer: Observer<boolean>) {
    this.authenticationSubscription.unsubscribe();
    if (result) {
      observer.next(true);
    }
    else {
      console.log("bye");
      observer.next(false);
      this.router.navigate(['/login']);
    }
    observer.complete();
  }
}
