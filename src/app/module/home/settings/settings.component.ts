import { Component, OnInit } from '@angular/core';
import { findingsAndImpression } from 'src/app/constants/findingsAndImpression';

@Component({
  selector: 'cxr-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
// SettingsComponent class implementation
export class SettingsComponent implements OnInit {
  readonly constants = findingsAndImpression;
  finding: { text: string }[];
  impression: { name: string }[];

  /*
   * constructor for SettingsComponent class
   */

  constructor() {}

  /**
   * This is a init function, retrieve current user details.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    this.finding = this.constants.findings;
    this.impression = this.constants.impressions;
  }
}
