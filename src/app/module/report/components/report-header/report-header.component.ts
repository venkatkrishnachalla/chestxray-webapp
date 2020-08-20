import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss'],
})
export class ReportHeaderComponent implements OnInit {
  constructor() {}
  cxrPrintHeaderName: string = 'CXR Radiological Report';
  ngOnInit(): void {}
}
