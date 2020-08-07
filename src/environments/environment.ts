// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isMockAPI: false,
  apiEndPoint: '',
  mockApiEndPoint: 'http://localhost:3000',
  appVersion: require('../../package.json').version + ' ' + '- dev',

  // tslint:disable-next-line: no-string-literal
  loginAPI : window['login'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/identity/v1/Account/Login/',
  // tslint:disable-next-line: no-string-literal
  RefreshToken: window['refreshToken'] || 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=',
  // tslint:disable-next-line: no-string-literal
  patientList: window['patientList'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/',
  // tslint:disable-next-line: no-string-literal
  patientInstanceId: window['patientInstanceId'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/',
  // tslint:disable-next-line: no-string-literal
  PatientImage: window['patientImage'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/instance/',
  // tslint:disable-next-line: no-string-literal
  askAI: window['askAI'] || 'http://52.167.73.54:80/seldon/seldon/cxr-classifier/api/v1.0/predictions'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
