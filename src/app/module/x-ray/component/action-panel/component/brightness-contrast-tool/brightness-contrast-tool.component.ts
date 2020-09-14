import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

@Component({
  selector: 'cxr-brightness-contrast-tool',
  templateUrl: './brightness-contrast-tool.component.html',
  styleUrls: ['./brightness-contrast-tool.component.scss'],
})

// BrightnessContrastToolComponent class implementation
export class BrightnessContrastToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  brightnessRangeValue = 50;
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
    showSelectionBar: true,
    disabled: false,
    selectionBarGradient: {
      from: '#285c68',
      to: '#285c68',
    },
  };

  contrastRangeValue = 50;
  option: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
    showSelectionBar: true,
    disabled: true,
    selectionBarGradient: {
      from: '#285c68',
      to: '#285c68',
    },
  };
  brightnessPanel: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];
  disableActionItems = true;

  /*
   * Constructor for BrightnessContrastToolComponent class
   */
  constructor(private eventEmitterService: EventEmitterService) {}

  /*
   * BrightnessContrastToolComponent class ngOnInit function
   */
  ngOnInit(): void {
    this.brightnessPanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelBrightness)
    );
    this.eventEmitterService.defaultRange.subscribe((data: number) => {
      this.brightnessRangeValue = data;
      this.contrastRangeValue = data;
    });
  }

  /**
   * This is a setBrightnessSlidervalue function.
   * @example
   * setBrightnessSlidervalue(event);
   */
  setBrightnessSlidervalue(event: number) {
    this.eventEmitterService.onBrightnessChange(event);
  }

  /**
   * This is a setContrastSlidervalue function.
   * @example
   * setContrastSlidervalue(event);
   */
  setContrastSlidervalue(event: number) {
    this.eventEmitterService.onContrastChange(event);
  }
}
