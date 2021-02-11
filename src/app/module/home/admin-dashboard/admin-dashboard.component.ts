import { Component, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import User from '../../auth/user.modal';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { RadiologistRegisterComponent } from './radiologist-register/radiologist-register.component';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from 'src/app/service/dashboard.service';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { SpinnerService } from '../../shared/UI/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { adminPatientsConstants } from 'src/app/constants/admin-patientConstants';
import { GridApi, Module } from 'ag-grid-community';
import { EventEmitterService2 } from 'src/app/service/event-emitter.service2';

interface PatientListData {
  data: PatientListData;
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
  forEach?: any;
  sort?: any;
  xRayList: any;
  count: string;
}
@Component({
  selector: 'cxr-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})

export class AdminDashboardComponent implements OnInit {
  gridApi;
  gridColumnApi;

  private userSubscription: Subscription;
  patientList: any = [];
  rowData:any = [];
  displayedColumns: string[] = ['hospitalPatientId', 'name','radiologist', 'birthDate', 'sex', 'age','status'];
  dataSource;
  showError: boolean;
  showloader: boolean;
  showTable: boolean;
  overlayNoRowsTemplate: string;
  errorMessage: string;
  showPatientInfo: boolean;
  pageCount: string;
  rowModelType: string;
  paginationPageSize: number;
  cacheBlockSize: number;
  totalPages: number;
  showPagination: boolean;
  searchValue: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(RadiologistRegisterComponent) radiologist: RadiologistRegisterComponent;
  xray: any[];
  defaultColDef;
  columnDefs;
  readonly constants = adminPatientsConstants;

  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private eventEmitterService: EventEmitterService,
    private dbService: NgxIndexedDBService,
    private eventEmitterService2: EventEmitterService2,

    ) {
      this.authService.addRadiologist.next(false);
    }

  ngOnInit(): void {
    this.spinnerService.show();

  
    // To open addRadiologist pop up modal
    this.authService.addRadiologist.subscribe((status: boolean) => {
      if (status){
      this.dialog.open(RadiologistRegisterComponent, { disableClose: true, width: '100%' });
      }
    });

    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          const UserInfo = JSON.parse(JSON.stringify(user));
          sessionStorage.setItem('accessToken', UserInfo._token);
          const tokenNew = window.btoa(UserInfo._token);
          UserInfo._token = tokenNew;
          sessionStorage.setItem('userAuthData', JSON.stringify(UserInfo));
        }
      }
    );
    this.getPatientList(1, 10);
    this.eventEmitterService2.invokePageNumberClick.subscribe((data: any) => {
      this.getPatientList(data.page, data.size);
    });
    this.rowModelType = 'serverSide';
    this.paginationPageSize = 10;
    this.cacheBlockSize = 10;
    sessionStorage.removeItem('x-ray_Data');
    sessionStorage.removeItem('impression');
    sessionStorage.removeItem('findings');
    sessionStorage.removeItem('noFindings');
    sessionStorage.removeItem('unableToDiagnose');
    sessionStorage.removeItem('ellipse');
    this.dbService.clear('PatientImage').subscribe((successDeleted) => {});
    sessionStorage.setItem('reportPageSelection', 'false');
    sessionStorage.setItem('nextAndPrevCheck', 'false');
    this.overlayNoRowsTemplate = 'No Data Available';
    this.showError = false;
    this.defaultColDef = { width: 200, lockPosition: true };
    this.columnDefs = this.constants.patientDashboard.headers;
    this.showPagination = false;
    this.rowModelType = 'serverSide';
    this.paginationPageSize = 10;
    this.cacheBlockSize = 10;
  }
  get PaginationPageSize(): number {
    return this.paginationPageSize;
  }

  get gridAPI(): GridApi {
    return this.gridApi;
  }

  get TotalPages(): number {
    return this.totalPages;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    window.onresize = (e) => {
      this.gridApi.sizeColumnsToFit();
    };
    this.autoSizeAll(false);
  }
  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  getPatientList(page, size) {
    if (this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    // this.showloader = true;
     this.showTable = false;
    this.dashboardService.getAdminPatientList('NotAnnotated', page, size).subscribe( (patientsList: PatientListData) => {
      console.log(patientsList)
      this.showloader = false;
      this.showTable = true;
      this.showError = false;
      this.spinnerService.hide();
      this.rowData = patientsList.data;
      // tslint:disable-next-line: radix
      this.totalPages = Math.ceil(parseInt(patientsList.count) / 10);
      const patientRows = patientsList.data;
      this.showPagination = true;
      this.gridApi.hideOverlay();
      patientRows.sort(
        (d1, d2) => d1.hospitalPatientId - d2.hospitalPatientId
      );
      patientRows.forEach((value, index) => {
        value.index = index;
      });
      let idSequence = 1;
      this.rowData.forEach((item) => {
        item.id = idSequence++;
      });
      const sessionRows = JSON.stringify(patientRows);
      sessionStorage.setItem('patientRows', sessionRows);
    },
    (errorMessage: string) => {
      this.showloader = false;
      this.showTable = false;
      this.eventEmitterService.onErrorMessage({
        data: errorMessage,
      });
    }
    );
  }
}
