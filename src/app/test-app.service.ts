import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

const apiURL = 'https://mo9se82md9.execute-api.us-west-2.amazonaws.com/testing/RideApp2';

// const apiURL = 'https://immense-wildwood-98911.herokuapp.com/';

@Injectable()
export class TestAppService {

  constructor(private http: HttpClient) { }

  getRides() {
    return this.http.get(apiURL);
  }
}
