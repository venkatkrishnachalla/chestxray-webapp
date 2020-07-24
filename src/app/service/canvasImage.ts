import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiEndPointService } from '../core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class XRayImageService {
  constructor(private http: HttpClient, private endpoint: ApiEndPointService) {}

  /*** get Patient Image rest api call ***/
  getPatientImage(id: string) {
    const body = {
      'content-type': 'application/json',
    };
    return this.http
      .get(this.endpoint.getPatientImage(id), {
        headers: body,
        responseType: 'text',
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          return responseData;
        })
      );
  }

  /*** get getPatientInstanceId rest api call ***/
  getPatientInstanceId(id: string) {
    const body = {
      'content-type': 'application/json',
    };
    return this.http
      .get(this.endpoint.getPatientInstanceId(id), {
        headers: body,
        responseType: 'json',
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          return responseData;
        })
      );
  }

  /*** handle error messages ***/
  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }
}
