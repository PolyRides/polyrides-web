import { Component, OnInit } from '@angular/core';
import {TestAppService} from './test-app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private testAppService: TestAppService) {}

  ngOnInit() {
    this.testAppService.getRides().subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }
}
