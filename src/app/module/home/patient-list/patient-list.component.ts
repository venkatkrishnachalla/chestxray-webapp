import { Component, OnInit, ElementRef } from '@angular/core';
import { home_constants } from 'src/app/constants/homeConstants';
import { HttpClient } from '@angular/common/http';
import PerfectScrollbar from 'perfect-scrollbar';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cxr-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit {
  private gridApi;
  private gridColumnApi;

  columnDefs;
  defaultColDef;
  rowData = [];
  readonly constants = home_constants;
  domLayout: any;
  searchValue: String = '';
  isLoading: boolean = false;
  doctorId: any;
  errorMessage: any;
  ShowError: boolean = false;

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private dashboardService: DashboardService,
    private router: Router
  ) {}
  ngOnInit() {
    this.doctorId = localStorage.getItem('userAuthData');
    this.defaultColDef = { width: 200 };
    // this.rowData = this.constants.patientDashboard.sampleData;
    this.columnDefs = this.constants.patientDashboard.headers;
    this.getPatientList();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector(
      '.ag-body-viewport'
    );
    if (agBodyViewport) {
      const ps = new PerfectScrollbar(agBodyViewport);
      ps.update();
    }
    this.autoSizeAll(false);
  }

  autoSizeAll(skipHeader) {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  getPatientList() {
    const networkStatus = navigator.onLine;
    this.isLoading = true;
    this.dashboardService.getPatientList().subscribe(
      (patientsList: any) => {
        this.ShowError = false;
        this.rowData = patientsList;
      },
      (errorMessage: any) => {
        this.ShowError = true;
        this.isLoading = false;
        this.errorMessage = errorMessage;
      }
    );
  }
}
