import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiEndPointService } from '../core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

// XRayImageService class implementation
export class XRayImageService {
  constructor(private http: HttpClient, private endpoint: ApiEndPointService) {}

  /**
   * get Patient Image rest api call
   * @param '{string}' value - A string param
   * @example
   * getPatientImage(id);
   */
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

  /**
   * get getPatientInstanceId rest api call
   * @param '{string}' value - A string param
   * @example
   * getPatientInstanceId(id);
   */
  getPatientInstanceId(id: string, check: boolean) {
    const body = {
      'content-type': 'application/json',
    };
    return this.http
      .get(this.endpoint.getPatientInstanceId(id, check), {
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
