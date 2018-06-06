import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-shell',
  templateUrl: './main-shell.component.html',
  styleUrls: ['./main-shell.component.css']
})
export class MainShellComponent implements OnInit {

  navLinks: any[];

  constructor() {
    this.navLinks = [
      {
        label: 'My Rides Offered',
        path: 'rides'
      },
      {
        label: 'My Ride Requests',
        path: 'requests'
      },
      {
        label: 'All My Rides',
        path: 'all'
      }
    ];
  }

  ngOnInit() {
  }

}
