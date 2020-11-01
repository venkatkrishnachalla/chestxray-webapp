import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss'],
})
// ReportHeaderComponent class implementation
export class ReportHeaderComponent implements OnInit {
  /*
   * constructor for ReportHeaderComponent class
   */
  constructor() {}
  cxrPrintHeaderName: string;
  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    this.cxrPrintHeaderName = 'CXR Radiological Report';
  }
}
