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
    this.baseUrl = environment.isMockAPI
      ? environment.mockApiEndPoint
      : environment.apiEndPoint;
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
    if (environment.isMockAPI) {
      return environment.mockApiEndPoint + '/auth';
    }
    return 'https://chestxrayqa.southindia.cloudapp.azure.com/identity/v1/Account/Login/';
  }

  public getRefreshToken(): string {
    if (environment.isMockAPI) {
      return environment.mockApiEndPoint + '/auth';
    }
    const FIREBASE_API_KEY = 'AIzaSyBmHTkeOUxDWQ9VDLx2TP3mzyhbamcGHiI';
    return (
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' +
      FIREBASE_API_KEY
    );
  }

  public getPatientList(): string {
    if (environment.isMockAPI) {
      return environment.mockApiEndPoint + '/patients';
    }
    return 'http://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/';
  }

  public getPatientInstanceId(id): any {
    return (
      'http://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/' + id
       +
      '/studies'
    );
  }
  
  public getPatientImage(id): any {
    return (
      'http://chestxrayqa.southindia.cloudapp.azure.com/api/instance/' + id
       +
      '/image'
    );
  }

  public getAskAi(): string {
    // if (environment.isMockAPI) {
    //   return environment.mockApiEndPoint + '/predictions';
    // }
    return 'http://52.167.73.54:80/seldon/seldon/cxr-classifier/api/v1.0/predictions';
  }
}
