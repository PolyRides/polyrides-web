import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

const apiURL = 'https://mo9se82md9.execute-api.us-west-2.amazonaws.com/testing/RideApp2';

@Injectable()
export class TestAppService {

  constructor(private http: HttpClient) { }

  getRides() {
    return this.http.get(apiURL);
  }
}
