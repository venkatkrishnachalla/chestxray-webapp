const authLogin= window.cxrDomain + '/identity-test/v1/Account/Login/';
const authRefreshToken = window.cxrDomain +'/identity-test/v1/Account/RefreshToken';
const authRevokeToken = window.cxrDomain +'/identity-test/v1/Account/RevokeToken';
const patientList = window.cxrDomain +'/api-test/v1/Patient';
const patientInstanceId = window.cxrDomain +'/api-test/v1/Patient/XRay/';
const PatientImage= window.cxrDomain +'/api-test/v1/Patient/XRay/';
const askAI = window.askAI +'/seldon/seldon/cxr-classifier/api/v1.0/predictions';
const submitReport = window.cxrDomain +'/api-test/v1/Annotation';
// tslint:disable-next-line: no-string-literal
const signature = window.cxrDomain + '/identity-test/v1/Account/DigitalSignature';

window ["login"] = authLogin;
window ["refreshToken"] = authRefreshToken;
window ["revokeToken"] = authRevokeToken;
window ["patientList"] = patientList ;
window ["patientInstanceId"] = patientInstanceId;
window ["patientImage"]= PatientImage;
window ["askAI"] = askAI;
window ["submit"] = submitReport;
window ["signature"] = signature;