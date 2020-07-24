import { Component, OnInit, ElementRef } from '@angular/core';
import { homeConstants } from 'src/app/constants/homeConstants';
import { DashboardService } from 'src/app/service/dashboard.service';
import { AuthService } from 'src/app/module/auth/auth.service';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

interface PatientListData {
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
}

interface EnumServiceItems extends Array<PatientListData> {}
@Component({
  selector: 'cxr-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit {
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

  constructor(
    private elementRef: ElementRef,
    private dashboardService: DashboardService,
    private authService: AuthService,
    public router: Router,
    private eventEmitterService: EventEmitterService
  ) {}

  /*** class init function ***/
  ngOnInit() {
    this.overlayNoRowsTemplate = 'No Data Available';
    this.showError = false;
    this.defaultColDef = { width: 200 };
    this.columnDefs = this.constants.patientDashboard.headers;
    this.getPatientList();
  }

  /*** onGridReady method ***/
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    window.onresize = (e) => {
      this.gridApi.sizeColumnsToFit();
    };
    this.autoSizeAll(false);
  }

  /*** auth size all method ***/
  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  /** get patient list function ***/
  getPatientList() {
    this.showloader = true;
    this.showTable = false;
    this.dashboardService.getPatientList().subscribe(
      (patientsList: PatientListData) => {
        this.showloader = false;
        this.showTable = true;
        this.showError = false;
        this.rowData = patientsList;
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

  /** row click function ***/
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

  /*** onActionViewClick icon click function ***/
  public onActionViewClick(data: any) {
    alert('View action clicked');
  }

  /*** onActionRedirectClick function , it will redirect to xray page ***/
  public onActionRedirectClick(data: any) {
    const patientDetail = JSON.stringify(data);
    sessionStorage.setItem('patientDetail', patientDetail);
    this.router.navigate(['x-ray'], { state: { patientDetails: data } });
  }
}
