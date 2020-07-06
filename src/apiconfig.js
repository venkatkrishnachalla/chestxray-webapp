const authLogin= window.login + '/identity/v1/Account/Login/';
const authRefreshToken = window.refreshToken +'/v1/accounts:';
const patientList = window.patient +'/api/v1/Patient/' ;
const patientInstanceId = window.patient +'/api/v1/Patient/';
const PatientImage= window.patient +'/api/instance/';
const askAI = window.askAI +'/seldon/seldon/cxr-classifier/api/v1.0/predictions';

window ["login"] = authLogin;
window ["refreshToken"] = authRefreshToken;
window ["patientList"] = patientList ;
window ["patientInstanceId"] = patientInstanceId;
window ["patientImage"]= PatientImage;
window ["askAI"] = askAI;