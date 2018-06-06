import { Component, OnInit } from '@angular/core';
import {ThemePalette} from "@angular/material";

@Component({
  selector: 'app-main-shell',
  templateUrl: './main-shell.component.html',
  styleUrls: ['./main-shell.component.css']
})
export class MainShellComponent implements OnInit {

  navLinks: any[];
  themePalette: ThemePalette;

  constructor() {
    this.navLinks = [
      {
        label: 'My Ride Offers',
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
    // this.themePalette = 'red';
  }

  ngOnInit() {
  }

}
