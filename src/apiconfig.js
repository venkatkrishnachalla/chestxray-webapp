const authLogin= window.cxrDomain + '/identity-test/v1/Account/Login/';
const authRefreshToken = window.cxrDomain +'/identity-test/v1/Account/RefreshToken';
const patientList = window.cxrDomain +'/api-dev/v1/Patient';
const patientInstanceId = window.cxrDomain +'/api-dev/v1/Patient/XRay/';
const PatientImage= window.cxrDomain +'/api-dev/v1/Patient/XRay/';
const askAI = window.askAI +'/seldon/seldon/cxr-classifier/api/v1.0/predictions';
const submitReport = window.cxrDomain +'/api-dev/v1/Annotation';

window ["login"] = authLogin;
window ["refreshToken"] = authRefreshToken;
window ["patientList"] = patientList ;
window ["patientInstanceId"] = patientInstanceId;
window ["patientImage"]= PatientImage;
window ["askAI"] = askAI;
window ["submit"] = submitReport;