import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { homeConstants } from 'src/app/constants/homeConstants';
import { DashboardService } from 'src/app/service/dashboard.service';
import { AuthService } from 'src/app/module/auth/auth.service';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { EventEmitterService2 } from 'src/app/service/event-emitter.service2';
import { Subject } from 'rxjs';
import User from '../../auth/user.modal';
import { Subscription } from 'rxjs';
import { userInfo } from 'os';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { GridApi, Module } from 'ag-grid-community';
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

interface EnumServiceItems extends Array<PatientListData> {}
@Component({
  selector: 'cxr-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit, OnDestroy {
  /*
   * constructor for PatientListComponent class
   */

  constructor(
    private elementRef: ElementRef,
    private dashboardService: DashboardService,
    private authService: AuthService,
    public router: Router,
    private eventEmitterService: EventEmitterService,
    private dbService: NgxIndexedDBService,
    private eventEmitterService2: EventEmitterService2
  ) {}
  gridApi;
  gridColumnApi;
  columnDefs;
  defaultColDef;
  rowData: PatientListData;
  readonly constants = homeConstants;
  domLayout: string;
  searchValue: string;
  errorStatus: string;
  showError: boolean;
  showloader: boolean;
  showTable: boolean;
  overlayNoRowsTemplate: string;
  errorMessage: string;
  showPatientInfo: boolean;
  pageCount: string;
  rowModelType: string;
  dataSource: object;
  paginationPageSize: number;
  cacheBlockSize: number;
  totalPages: number;
  showPagination: boolean;
  patientInfoSubject: Subject<any> = new Subject<any>();
  @ViewChild('toggleButton') toggleButton: ElementRef;
  private userSubscription: Subscription;
  get PaginationPageSize(): number {
    return this.paginationPageSize;
  }

  get gridAPI(): GridApi {
    return this.gridApi;
  }

  get TotalPages(): number {
    return this.totalPages;
  }

  /**
   * This is a init function, retrieve current user details.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit() {
    this.showPagination = false;
    this.rowModelType = 'serverSide';
    this.paginationPageSize = 10;
    this.cacheBlockSize = 10;
    sessionStorage.removeItem('findingsData');
    sessionStorage.removeItem('x-ray_Data');
    sessionStorage.removeItem('impression');
    sessionStorage.removeItem('findings');
    sessionStorage.removeItem('noFindings');
    sessionStorage.removeItem('unableToDiagnose');
    sessionStorage.removeItem('ellipse');
    sessionStorage.removeItem('reportComments');
    this.dbService.clear('PatientImage').subscribe((successDeleted) => {});
    sessionStorage.setItem('reportPageSelection', 'false');
    sessionStorage.setItem('nextAndPrevCheck', 'false');
    sessionStorage.setItem('isManualFindingsAdded', 'false');
    this.overlayNoRowsTemplate = 'No Data Available';
    this.showError = false;
    this.defaultColDef = { width: 200, lockPosition: true };
    this.columnDefs = this.constants.patientDashboard.headers;
    this.getPatientList(1, 10);
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        const UserInfo = JSON.parse(JSON.stringify(user));
        sessionStorage.setItem('accessToken', UserInfo._token);
        if (UserInfo._token) {
          const tokenNew = window.btoa(UserInfo._token);
          UserInfo._token = tokenNew;
        }
        sessionStorage.setItem('userAuthData', JSON.stringify(UserInfo));
      }
    );
    this.eventEmitterService2.invokePageNumberClick.subscribe((data: any) => {
      this.getPatientList(data.page, data.size);
    });
  }

  /**
   * This is on ionGridReady method.
   * @param '{string}' value - A string param
   * @example
   * onGridReady(params);
   */

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    window.onresize = (e) => {
      this.gridApi.sizeColumnsToFit();
    };
    this.autoSizeAll(false);
  }

  /**
   * This is on auth size all method.
   * @param '{string}' value - A string param
   * @example
   * autoSizeAll(skipHeader);
   */
  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  /**
   * This is on get patient list function .
   * @param '{void}' empty - A empty param
   * @example
   * getPatientList();
   */
  getPatientList(page, size) {
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
    this.showTable = false;
    this.dashboardService.getPatientList(page, size).subscribe(
      (patientsList: PatientListData) => {
        this.showloader = false;
        this.showTable = true;
        this.showError = false;
        this.rowData = patientsList.data;
        // tslint:disable-next-line: radix
        this.totalPages = Math.ceil(parseInt(patientsList.count) / 10);
        const patientRows = patientsList.data;
        this.showPagination = true;
        if (this.gridApi) {
          this.gridApi.hideOverlay();
        }
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
        if (page === 1) {
          const sessionRows = JSON.stringify(patientRows);
          sessionStorage.setItem('patientRows', sessionRows);
        } else {
          const sessionPatientRows = JSON.parse(
            sessionStorage.getItem('patientRows')
          );
          const concatArray = sessionPatientRows.concat(patientRows);
          const concatUniqueArray = concatArray.filter(
            (test, index, array) =>
              index ===
              array.findIndex(
                (findTest) =>
                  findTest.hospitalPatientId === test.hospitalPatientId
              )
          );
          concatUniqueArray.sort(
            (d1, d2) => d1.hospitalPatientId - d2.hospitalPatientId
          );
          concatUniqueArray.forEach((value, index) => {
            value.index = index;
          });
          const sessionRows = JSON.stringify(concatUniqueArray);
          sessionStorage.setItem('patientRows', sessionRows);
        }
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

  /**
   * This is on row click function.
   * @param '{string}' value - A string param
   * @example
   * onRowClicked(e);
   */
  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      const data = e.data;
      const actionType = e.event.target.getAttribute('data-action-type');
      switch (actionType) {
        case 'viewInfo':
          return this.onActionViewClick(data);
        case 'redirect':
          return this.onActionRedirectClick(data);
      }
    }
  }

  /**
   * This is on onActionViewClick icon click function
   * @param '{any}' data - A any param
   * @example
   * onActionViewClick(data);
   */
  public onActionViewClick(data: any) {
    this.showPatientInfo = true;
    this.patientInfoSubject.next(data);
  }

  /**
   * This is on onActionRedirectClick function , it will redirect to xray page
   * @param '{any}' data - A any param
   * @example
   * onActionRedirectClick(data);
   */
  public onActionRedirectClick(data: any) {
    const patientDetail = JSON.stringify(data);
    sessionStorage.setItem('patientDetail', patientDetail);
    sessionStorage.setItem('askAiSelection', 'false');
    this.router.navigate(['x-ray'], { state: { patientDetails: data } });
  }

  /**
   * This is on toggleMenu function
   * @param '{void}' empty - A void param
   * @example
   * toggleMenu();
   */
  toggleMenu() {
    this.showPatientInfo = !this.showPatientInfo;
  }
  /**
   * This is on ngOnDestroy function
   * @param '{void}' empty - A void param
   * @example
   * ngOnDestroy();
   */
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
