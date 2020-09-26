import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {

  constructor(private http: HttpClient) { }

  addRadiologist(radiologist) {
    return this.http.post(environment.addRadiologist, radiologist);
  }
}
