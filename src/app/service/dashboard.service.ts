import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface patientData{
    
  }
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private http: HttpClient,
    private endpoint: ApiEndPointService,
  ) { }

  getPatientList() {
    return this.http.get<patientData>(this.endpoint.getPatientList(),
    // {
    //   doctorId
    // }
    )
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
