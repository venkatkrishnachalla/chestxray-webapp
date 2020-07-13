export const environment = {
  production: true,
  // tslint:disable-next-line: no-string-literal
  loginAPI : window['login'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/identity/v1/Account/Login/',
    // tslint:disable-next-line: no-string-literal
  RefreshToken: window['refreshToken'] || 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=',
    // tslint:disable-next-line: no-string-literal
  patientList: window['patientList'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/',  patientInstanceId: window['patientInstanceId'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/',
    // tslint:disable-next-line: no-string-literal
  PatientImage: window['patientImage'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/instance/',
    // tslint:disable-next-line: no-string-literal
  askAI: window['askAI'] || 'https://52.167.73.54:80/seldon/seldon/cxr-classifier/api/v1.0/predictions'
};
