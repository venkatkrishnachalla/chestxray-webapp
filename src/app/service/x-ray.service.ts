import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';

interface AiData {
  data: [];
}
@Injectable({
  providedIn: 'root',
})
export class XRayService {
  private annotatedXraySubject = new BehaviorSubject<any>({});
  private annotatedXrayImpressionSubject = new BehaviorSubject<any>({});
  private annotatedXrayFindingsSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private endpoint: ApiEndPointService) {}

  /*** getAskAiDetails rest api get call ***/
  getAskAiDetails(PatientImage: string, fileName: string) {
    const data = {
      data: {
        ndarray: [PatientImage, fileName],
      },
    };
    const saveArray = JSON.stringify(data);
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      }),
    };
    const headers = {
      'content-type': 'application/json',
      responseType: 'json',
    };
    return this.http.post(this.endpoint.getAskAi(), saveArray, httpOptions);
  }

  /*** submitReport rest api call ***/
  submitReport(postData: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      }),
    };
    return this.http.post(this.endpoint.submitReport(), JSON.stringify(postData), httpOptions);
  }

  /*** handle error function ***/
  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse.error.error.message);
  }

  /*** xrayAnnotatedService function ***/
  xrayAnnotatedService(event) {
    this.annotatedXraySubject.next(event);
  }

  /*** getAnnotatedImageData function ***/
  getAnnotatedImageData() {
    return this.annotatedXraySubject.asObservable();
  }

  /*** xrayAnnotatedImpressions function ***/
  xrayAnnotatedImpressions(event) {
    this.annotatedXrayImpressionSubject.next(event);
  }

  /*** xrayAnnotatedImpressionsService function ***/
  xrayAnnotatedImpressionsService() {
    return this.annotatedXrayImpressionSubject.asObservable();
  }

  /*** xrayAnnotatedFindings function ***/
  xrayAnnotatedFindings(event) {
    this.annotatedXrayFindingsSubject.next(event);
  }

  /*** xrayAnnotatedFindingsService function ***/
  xrayAnnotatedFindingsService() {
    return this.annotatedXrayFindingsSubject.asObservable();
  }
}
