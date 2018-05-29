import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AngularFireAuth } from "angularfire2/auth";
import {SessionService} from "./session.service";
import {Subscription} from "rxjs/internal/Subscription";

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
              console.log(data);
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
      this.router.navigate(['/login']);
      observer.next(false);
    }
    observer.complete();
  }
}
