import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cxr-x-ray-header',
  templateUrl: './x-ray-header.component.html',
  styleUrls: ['./x-ray-header.component.scss']
})
export class XRayHeaderComponent implements OnInit {
  patientID: string;

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.patientID = '1004';
  }

}
