import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-brightness-contrast-tool',
  templateUrl: './brightness-contrast-tool.component.html',
  styleUrls: ['./brightness-contrast-tool.component.scss'],
})

// BrightnessContrastToolComponent class implementation
export class BrightnessContrastToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  value = 70;
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#285c68',
      to: '#285c68',
    },
  };

  values = 50;
  option: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#285c68',
      to: '#285c68',
    },
  };
  brightnessPanel: { image: string; alt: string; title: string }[];
  disableActionItems = true;

  /*
   * Constructor for BrightnessContrastToolComponent class
   */
  constructor() {}

  /*
   * BrightnessContrastToolComponent class ngOnInit function
   */
  ngOnInit(): void {
    this.brightnessPanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelBrightness)
    );
  }
}
