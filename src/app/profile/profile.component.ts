import {Component, OnDestroy, OnInit} from '@angular/core';
import {SessionService} from "../session.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  displayName: string;
  emailAddress: string;
  basicUserSubscription: Subscription;

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    this.basicUserSubscription = this.sessionService.basicUserInfo.subscribe(
      (data) => {
        this.displayName = data.firstName + " " + data.lastName;
        this.emailAddress = data.emailAddress;
      }
    );
  }

  sessionSignOut() {
    this.sessionService.logout().then(
      () => {
        this.router.navigate(["/loggedout"]);
      }).catch((err) => {
        console.log(err);
      });

  }


  ngOnDestroy() {
    this.basicUserSubscription.unsubscribe();
  }

}
