import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { actionPanelConstants } from '../../../../constants/actionPanelConstants';
import { Options } from 'ng5-slider';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cxr-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss'],
})
export class ActionPanelComponent implements OnInit {
  @Output() askAIEvent = new EventEmitter();
  value = 70;
  askAiTitle = 'Already ML Annotations updated';
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
    disabled: true,
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
    disabled: true,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#285c68',
      to: '#285c68',
    },
  };

  readonly constants = actionPanelConstants;
  actionPanel: { 
    image: string; 
    alt: string; 
    title: string; 
    active: boolean;
    implemented: boolean;
  }[];
  middlePanel: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];
  brightnessPanel: { image: string; alt: string; title: string }[];
  disableAskAI: boolean;
  disableActionItems = true;
  _subscription: Subscription;

  constructor(private eventEmitterService: EventEmitterService) {
    this._subscription = this.eventEmitterService.invokePrevNextButtonDataFunction.subscribe(
      (patientId: string) => {
        this.disableAskAI = false;
      }
    );
  }

  /*** class init function ***/
  ngOnInit(): void {
    this.actionPanel = JSON.parse(JSON.stringify(this.constants.actionPanelTop));
    this.middlePanel = JSON.parse(JSON.stringify(this.constants.actionPanelMiddle));
    this.brightnessPanel = JSON.parse(JSON.stringify(this.constants.actionPanelBrightness));
    const askAiSelection = sessionStorage.getItem('askAiSelection');
    if (askAiSelection === 'true') {
      this.disableAskAI = true;
    }
  }

  /*** icon click event & changing active icon ***/
  iconAction(data, index) {
    for (const key in data) {
      // tslint:disable-next-line: radix
      if (parseInt(key) !== index) {
        data[key].active = false;
      }
    }
    data[index].active = data[index].active ? false : true;
    this.eventEmitterService.onComponentButtonClick(data[index]);
  }

  /*** Ask ai click event ***/
  askAI() {
    this.askAIEvent.emit(true);
  }

  /*** Event to disable ask ai button ***/
  disableAskAiButton() {
    this.disableAskAI = true;
    sessionStorage.setItem('askAiSelection', 'true');
  }

  /*** on destroy event subscription ***/
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
