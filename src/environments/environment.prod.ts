export const environment = {
  production: true,
  loginAPI : window['login'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/identity/v1/Account/Login/',
  RefreshToken: window['refreshToken'] || 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=',
  patientList: window['patientList'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/',
  patientInstanceId: window['patientInstanceId'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/',
  PatientImage: window['patientImage'] || 'https://chestxrayqa.southindia.cloudapp.azure.com/api/instance/',
  askAI: window['askAI'] || 'https://52.167.73.54:80/seldon/seldon/cxr-classifier/api/v1.0/predictions'
};
