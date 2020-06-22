import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private endpoint: ApiEndPointService,
  ) { }

  getPatientList() {
    return this.http.get(this.endpoint.getPatientList(), {});
  }
}
