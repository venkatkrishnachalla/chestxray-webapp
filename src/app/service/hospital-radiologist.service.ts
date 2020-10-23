import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface RadiologistList {
  // birthDate: string;
  // hospitalPatientId: string;
  //  id: string;
  // lastUpdate: string;
  userName: string;
  email:string;
  role:string;
  // referringPhysicianName: string;
  // sex: string;
  // status: boolean;
  // studies: string[];
}

@Injectable({
  providedIn: 'root'
})
export class HospitalRadiologistService {
  constructor(private http: HttpClient, private endpoint: ApiEndPointService) {}

  /*** get list patient list from rest api call ***/
  getradiologistList() {
    return this.http.get<RadiologistList>(this.endpoint.getRadiologistList()).pipe(
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
