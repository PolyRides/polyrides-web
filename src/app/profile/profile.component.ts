import { Component, OnInit } from '@angular/core';
import {SessionService} from "../session.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
  }

  sessionSignOut() {
    this.sessionService.logout().then(
      () => {
        this.router.navigate(["/loggedout"]);
      }).catch((err) => {
        console.log(err);
      });
    }

}
