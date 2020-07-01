import { Component, OnInit, ElementRef } from '@angular/core';
import { home_constants } from 'src/app/constants/homeConstants';
import { DashboardService } from 'src/app/service/dashboard.service';
import { AuthService } from 'src/app/module/auth/auth.service';

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
  searchValue: String;
  doctorId: string;
  errorMessage: string;
  showError: boolean;

  constructor(
    private elementRef: ElementRef,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.showError = false;
    this.doctorId = this.authService.user.id;
    this.defaultColDef = { width: 200 };
    this.columnDefs = this.constants.patientDashboard.headers;
    this.getPatientList();
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
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  getPatientList() {
    this.dashboardService.getPatientList().subscribe(
      (patientsList: any) => {
        this.showError = false;
        this.rowData = patientsList;
      },
      (errorMessage: any) => {
        this.showError = true;
        this.errorMessage = errorMessage;
      }
    );
  }
}
