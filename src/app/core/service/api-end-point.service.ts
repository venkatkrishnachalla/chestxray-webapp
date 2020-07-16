import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';

type QueryParams = {
  key: string;
  value: string;
};
@Injectable({
  providedIn: 'root',
})
export class ApiEndPointService {
  private baseUrl: string;
  constructor() {
    // this.baseUrl = environment.isMockAPI
    //   ? environment.mockApiEndPoint
    //   : environment.apiEndPoint;
  }

  private getUrl(action: string, pathVariables: any[] = []): string {
    if (pathVariables.length === 0) {
      return [this.baseUrl, action].join('/');
    }
    let encodedPathVariablesUrl = '';
    // Push extra path variables
    for (const pathVariable of pathVariables) {
      if (pathVariable !== null) {
        encodedPathVariablesUrl += `/${encodeURIComponent(
          pathVariable.toString()
        )}`;
      }
    }
    return `${[this.baseUrl, action].join('/')}${encodedPathVariablesUrl}`;
  }

  private getHttpQueryParams(params: QueryParams[]): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    for (const param of params) {
      httpParams = httpParams.append(
        param.key,
        encodeURIComponent(param.value)
      );
    }
    return httpParams;
  }

  public getSingInURL(): string {
    // if (environment.isMockAPI) {
    //   return environment.mockApiEndPoint + '/auth';
    // }
    return environment.loginAPI;
  }

  public getRefreshToken(): string {
    // if (environment.isMockAPI) {
    //   return environment.mockApiEndPoint + '/auth';
    // }
    const FIREBASE_API_KEY = 'AIzaSyBmHTkeOUxDWQ9VDLx2TP3mzyhbamcGHiI';
    return ( environment.RefreshToken +
      'signInWithCustomToken?key=' +
      FIREBASE_API_KEY
    );
  }

  public getPatientList(): string {
    // if (environment.isMockAPI) {
    //   return environment.mockApiEndPoint + '/patients';
    // }
    return environment.patientList;
  }

  getPatientInstanceId(id): any {
    return (
      environment.patientInstanceId + id
       +
      '/studies'
    );
  }

  getPatientImage(id): any {
    return (
      environment.PatientImage + id
       +
      '/image'
    );
  }

  public getAskAi(): string {     
    // if (environment.isMockAPI) {     
    //   return environment.mockApiEndPoint + '/predictions';     
    // }     
    return 'https://cxraks.eastus2.cloudapp.azure.com/seldon/seldon/cxr-classifier/api/v1.0/predictions'; 
   // return '/api/v1.0/predictions';   
  }
}
