const authLogin= window.cxrDomain + '/identity/v1/Account/Login/';
const authRefreshToken = window.refreshToken +'/v1/accounts:';
const patientList = window.cxrDomain +'/api-test/v1/Patient/' ;
const patientInstanceId = window.cxrDomain +'/api/v1/Patient/';
const PatientImage= window.cxrDomain +'/api/instance/';
const askAI = window.askAI +'/seldon/seldon/cxr-classifier/api/v1.0/predictions';
const submitReport = window.cxrDomain +'/api-test/v1/Findings';

window ["login"] = authLogin;
window ["refreshToken"] = authRefreshToken;
window ["patientList"] = patientList ;
window ["patientInstanceId"] = patientInstanceId;
window ["patientImage"]= PatientImage;
window ["askAI"] = askAI;
window ["submit"] = submitReport;