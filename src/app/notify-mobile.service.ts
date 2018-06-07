import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotifyMobileService {

  constructor(private http: HttpClient) { }

  postNotification(data : any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('authorization', 'key=AIzaSyA_se-58n4sJP5ckp7NVURTuvgmDZamxiU');
    return this.http.post('https://fcm.googleapis.com/fcm/send', data,{ headers: headers });
  }
}
