import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AiData {
  data: [];
}
@Injectable({
  providedIn: 'root',
})
export class XRayService {
  constructor(private http: HttpClient, private endpoint: ApiEndPointService) {}

  getAskAiDetails(PatientImage) {
    const data = {
      data: {
        ndarray: [PatientImage],
      },
    };
    const saveArray = JSON.stringify(data);
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        responseType: 'json',
        'Access-Control-Allow-Origin': '*'
      }),
    };
    return this.http.post(this.endpoint.getAskAi(), saveArray, httpOptions);
  }
  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse.error.error.message);
  }
}
