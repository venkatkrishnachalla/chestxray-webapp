import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface PatientData {
  age: number;
  birthDate: string;
  hospitalPatientId: string;
  id: string;
  lastUpdate: string;
  name: string;
  referringPhysicianName: string;
  sex: string;
  status: boolean;
  studies: string[];
}
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private endpoint: ApiEndPointService) {}

  /*** get list patient list from rest api call ***/
  getPatientList() {
    return this.http.get<PatientData>(this.endpoint.getPatientList()).pipe(
      catchError(this.handleError),
      tap((responseData) => {
        return responseData;
      })
    );
  }

  /** handle error block ***/
  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }
}
