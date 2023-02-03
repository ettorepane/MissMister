import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
 constructor(private http: HttpClient) { }
 defaultUrl = 'http://localhost:3344/';

  get( url: string ) {
    return this.http.get(this.defaultUrl + url);
  }

  post( url: string, data: any ) {
    return this.http.post(this.defaultUrl + url, data);
  }

}
