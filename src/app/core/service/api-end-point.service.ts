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
// ApiEndPointService class implementation
export class ApiEndPointService {
  private baseUrl: string;
  /*
   * constructor for ApiEndPointService class
   */

  constructor() {
    // this.baseUrl = environment.isMockAPI
    //   ? environment.mockApiEndPoint
    //   : environment.apiEndPoint;
  }

  /**
   * This is a getUrl function.
   * @param '{string}' value - A string param
   * @param '{any}' data - A array param
   * @example
   * getUrl(action, pathVariables);
   */

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

  /**
   * This is a getHttpQueryParams function.
   * @param '{any}' HttpParams - A array param
   * @example
   * getHttpQueryParams(params);
   */

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

  /**
   * This is a getSingInURL function.
   * @param '{void}' empty - A empty param
   * @example
   * getSingInURL();
   */

  public getSingInURL(): string {
    // if (environment.isMockAPI) {
    //   return environment.mockApiEndPoint + '/auth';
    // }
    return environment.loginAPI;
  }

  /**
   * This is a getRefreshToken function.
   * @param '{void}' empty - A empty param
   * @example
   * getRefreshToken();
   */
  public putAssign(): string {
    return environment.XRayIdentifiers;
  }

  public getRefreshToken(): string {
    return environment.RefreshToken;
  }

  /**
   * This is a getPatientList function.
   * @param '{void}' empty - A empty param
   * @example
   * getPatientList();
   */

  public getPatientList(page, size): string {
    // if (environment.isMockAPI) {
    //   return environment.mockApiEndPoint + '/patients';
    // }
    return environment.patientList + '?page=' + page + '&size=' + size;
  }
  /**
   * This is a getPatientList function.
   * @param '{void}' empty - A empty param
   * @example
   * getPatientList();
   */

  public getAdminPatientList(): string {
    // if (environment.isMockAPI) {
    //   return environment.mockApiEndPoint + '/patients';
    // }
    return environment.patientList;
  }

  /**
   * This is a getPatientInstanceId function.
   * @param '{string}' value - A string param
   * @example
   * getPatientInstanceId(id);
   */

  getPatientInstanceId(xRayId): any {
    return environment.patientInstanceId + xRayId + '/Study';
  }
  public getRadiologistList(): string {
    return environment.hospitalRadiologistList;
  }

  /**
   * This is a getPatientImage function.
   * @param '{string}' value - A string param
   * @example
   * getPatientImage(id);
   */

  getPatientImage(id): any {
    return environment.PatientImage + id + '/image';
  }

  /**
   * This is a getAskAi function.
   * @param '{void}' empty - A empty param
   * @example
   * getAskAi();
   */

  public getAskAi(): string {
    // return 'https://cxraks.eastus2.cloudapp.azure.com/seldon/seldon/cxr-classifier/api/v1.0/predictions';
    // return 'https://cxrml.eastus2.cloudapp.azure.com/seldon/default/cxr-classifier/api/v1.0/predictions';
    return 'https://cxrmlstaging.eastus2.cloudapp.azure.com/seldon/default/cxr-classifier/api/v1.0/predictions'
  }
  /**
   * This is a getAskAi function.
   * @param '{void}' empty - A empty param
   * @example
   * getAskAi();
   */

  public submitReport(): string {
    return environment.submitReport;
  }

  /**
   * This is a getAskAi function.
   * @param '{void}' empty - A empty param
   * @example
   * getAskAi();
   */

  public getAnnotations(xRayId): string {
    return environment.submitReport + '?xrayid=' + xRayId;
  }
}
