import { ArrayType } from '@angular/compiler';

export interface SignInResponse {
  expiration: string;
  token: string;
  username: string;
  userroles: any[];
}

export interface PatientListData {
  age: number;
  birthDate: string;
  hospitalPatientId: string;
  id: string;
  lastUpdate: string;
  name: string;
  referringPhysicianName: string;
  sex: string;
  status: boolean;
  studies: any[];
  length?: number;
  findIndex?: any;
  xRayList: any;
}

export interface EnumServiceItems extends Array<PatientListData> {}

export interface MlApiData {
  data: any[];
}

export interface PatientDetailData {
  age: number;
  birthDate: string;
  hospitalPatientId: string;
  id: string;
  lastUpdate: string;
  name: string;
  referringPhysicianName: string;
  sex: string;
  status: boolean;
  studies: any[];
  imageSource?: string;
  isIndividualRadiologist?: boolean;
  studyId: string;
  seriesId: string;
  assignedTo: string;
  isAnnotated: boolean;
  xRayId: number;
  xRayList: ArrayType;
}

export interface EllipseData {
  index: number;
  name: string;
  split(arg0: string);
}

export interface MlApiData {
  data: any[];
}

export interface ImpressionData {
  color: string;
  id: number;
  isMLApi: false;
  name: string;
  title: string;
}

export interface ImpressionDataItems extends Array<ImpressionData> {}

export interface InvokeComponentData {
  title: string;
  data: any[];
  active: boolean;
}

export interface InvokeReportData {
  title: string;
  data: {
    age: number;
    birthDate: string;
    hospitalPatientId: string;
    id: string;
    lastUpdate: string;
    name: string;
    referringPhysicianName: string;
    sex: string;
    status: boolean;
    studies: any[];
  };
}
