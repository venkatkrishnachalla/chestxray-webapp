import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiEndPointService } from '../core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class xrayImageService {
  constructor(private http: HttpClient, private endpoint: ApiEndPointService) {}

  getPatientImage(id) {
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
  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse.error.error.message);
  }
}
