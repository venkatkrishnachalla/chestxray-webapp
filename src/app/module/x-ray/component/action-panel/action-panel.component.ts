import { Component, OnInit, ViewChild } from '@angular/core';
import { actionPanelConstants } from '../../../../constants/actionPanelConstants';
import { Options } from 'ng5-slider';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

@Component({
  selector: 'cxr-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss']
})
export class ActionPanelComponent implements OnInit {
  value = 70;
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#285c68',
      to: '#285c68'
    }
  };

  values = 50;
  option: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#285c68',
      to: '#285c68'
    }
  };

  readonly constants = actionPanelConstants;
  actionPanel: { image: string; alt: string; }[];
  middlePanel: { image: string; alt: string; }[];
  brightnessPanel: { image: string; alt: string; }[];
  constructor(private eventEmitterService: EventEmitterService ) { }

  ngOnInit(): void {
    this.actionPanel = this.constants.actionPanelTop;
    this.middlePanel = this.constants.actionPanelMiddle;
    this.brightnessPanel = this.constants.actionPanelBrightness;
  }
  iconAction(title){  
        this.eventEmitterService.onComponentButtonClick(title); 
  }

}
