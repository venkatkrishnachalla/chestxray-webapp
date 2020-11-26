import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

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
  xRayList: any;
}
@Injectable({
  providedIn: 'root',
})

// DashboardService class implementation
export class DashboardService {
  constructor(private http: HttpClient, private endpoint: ApiEndPointService) {}

  /**
   * get list patient list from rest api call
   * @param '{void}' empty - A empty param
   * @example
   * getPatientList();
   */
  getPatientList(page, size) {
    return this.http
      .get<PatientData>(this.endpoint.getPatientList(page, size))
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          return responseData;
        })
      );
  }

  getAdminPatientList(status: string, page, size) {
    return this.http
      .get<PatientData>(this.endpoint.getAdminPatientList(page, size), {
        params: { status: status },
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          return responseData;
        })
      );
  }

  isSubmit(assignPatients, assignedTo): Observable<any> {
    let url = this.endpoint.putAssign();
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      }),
    };

    return this.http.put(
      `https://chestxrayqa.southindia.cloudapp.azure.com/api-dev/v1/XRayIdentifiers?assignTo=${assignedTo}`,
      assignPatients,
      httpOptions
    );
  }
  /**
   * handle error messages
   * @param '{HttpErrorResponse}' HttpErrorResponse - A HttpErrorResponse param
   * @example
   * handleError(errorResponse);
   */
  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }
}
