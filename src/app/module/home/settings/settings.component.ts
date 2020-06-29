import { Component, OnInit } from '@angular/core';
import { findingsAndImpression } from 'src/app/constants/findingsAndImpression';

@Component({
  selector: 'cxr-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  readonly constants = findingsAndImpression;
  finding: { text: string; }[];
  impression: { name: string; }[];
  constructor() {}

  ngOnInit(): void {
    this.finding = this.constants.findings;
    this.impression = this.constants.impressions;
  }
}
