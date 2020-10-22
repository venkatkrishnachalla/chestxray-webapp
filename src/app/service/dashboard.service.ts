import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
// interface unassign {
//       id: string,
//       name: string,
//       sex: "string",
//       hospitalPatientId: string,
//       birthDate: string,
//       age: string,
//       xRayList: [
//         {
//           xRayId: string,
//           lastUpdate: string,
//           isAnnotated: boolean,
//           assignedTo: string
//         }
//       ]
// }
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
  getAdminPatientList(status: string) {
    return this.http.get<PatientData>(this.endpoint.getPatientList(),{ params: {status: status } }).pipe(
      catchError(this.handleError),
      tap((responseData) => {
        return responseData;
      })
    );
  }
  // unassignedPatientList() {
  //   return this.http.get<unassign>(this.endpoint.unassignedPatientList()).pipe(
  //     catchError(this.handleError),
  //     tap((responseData) => {
  //       return responseData;
  //     })
  //   );
  // }
  isSubmit(assignPatients,assignedTo):Observable<any> {
    let url = this.endpoint.putAssign()
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      }),
    };

    console.log(`${url}?assignTo=${assignedTo}`)
    return this.http.put(`http://chestxrayqa.southindia.cloudapp.azure.com/api-dev/v1/XRayIdentifiers?assignTo=${assignedTo}`,assignPatients, httpOptions)
    // .pipe(
    //   catchError(this.handleError),
    //   tap((responseData) => {
    //     console.log(responseData)
    //     return responseData;
    //   })
    // );
    }

  /** handle error block ***/
  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }
}
