import { Component, OnInit } from '@angular/core';
import { homeConstants } from 'src/app/constants/homeConstants';

@Component({
  selector: 'cxr-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  columnDefs: any;
  rowData: any;
  searchValue: string;
  gridApi: any;
  gridColumnApi: any;
  pageSize: any;
  domLayout: any;
  readonly constants = homeConstants;
  defaultColDef: any;
  constructor() {}

  ngOnInit(): void {
    this.domLayout = 'autoHeight';
    this.rowData = this.constants.patientDashboard.sampleData;
    this.columnDefs = this.constants.patientDashboard.headers;
  }
}
