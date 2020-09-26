export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  
  // tslint:disable-next-line: no-string-literal
  loginAPI : window['login'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/identity-test/v1/Account/Login/',
    // tslint:disable-next-line: no-string-literal
  RefreshToken: window['refreshToken'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/identity-test/v1/Account/RefreshToken',
    // tslint:disable-next-line: no-string-literal
  patientList: window['patientList'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api-dev/v1/Patient/',
    // tslint:disable-next-line: no-string-literal
  patientInstanceId: window['patientInstanceId'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/',
    // tslint:disable-next-line: no-string-literal
  PatientImage: window['patientImage'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/instance/',
    // tslint:disable-next-line: no-string-literal
  askAI: window['askAI'] || 'https://52.167.73.54:80/seldon/seldon/cxr-classifier/api/v1.0/predictions',
  // tslint:disable-next-line: no-string-literal
  submitReport: window['submit'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api-dev/v1/Annotation',
  // tslint:disable-next-line: no-string-literal
  addRadiologist: window['addRadiologist'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/identity-test/v1/Account/Register'
};
