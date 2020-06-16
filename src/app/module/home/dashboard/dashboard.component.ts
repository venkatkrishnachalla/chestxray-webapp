import { Component, OnInit, ElementRef } from '@angular/core';
import { home_Constants } from 'src/app/constants/homeConstants';
import { HttpClient } from "@angular/common/http";
import PerfectScrollbar from "perfect-scrollbar"

@Component({
  selector: 'cxr-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
