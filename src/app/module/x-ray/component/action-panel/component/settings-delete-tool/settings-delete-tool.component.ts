import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-settings-delete-tool',
  templateUrl: './settings-delete-tool.component.html',
  styleUrls: ['./settings-delete-tool.component.scss'],
})

// SettingsDeleteToolComponent class implementation
export class SettingsDeleteToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  settingDeletePanel: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];

  /*
   * Constructor for SettingsDeleteToolComponent class
   */
  constructor() {}

  /*** SettingsDeleteToolComponent class on init function ***/
  ngOnInit(): void {
    this.settingDeletePanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelSettingsDelete)
    );
  }

  /**
   * This is a iconAction click function.
   * @example
   * iconAction([ellipse], 1);
   */
  iconAction(data, index) {
    return null;
  }
}
