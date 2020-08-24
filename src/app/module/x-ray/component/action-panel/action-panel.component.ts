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
// ActionPanelComponent class implementation  
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
  actionPanel: { image: string; alt: string; title: string }[];
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

  /*  
* constructor for ActionPanelComponent class  
*/  
  constructor(private eventEmitterService: EventEmitterService) {
    this._subscription = this.eventEmitterService.invokePrevNextButtonDataFunction.subscribe(
      (patientId: string) => {
        this.disableAskAI = false;
      }
    );
  }

 /**  
* This is a init function.  
* @param {void} empty - A empty param  
* @example  
* ngOnInit();
*/  
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
   /**  
 * This is a icon click event & changing active icon function.  
 * @param {any} data - A array param  
 * @param {number} index - A number param  
 * @example  
 * iconAction([ellipse, freeHandDrawing] , 1);
 */  
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

/**  
* This is a Ask ai click event .  
* @param {void} empty - A empty param  
* @example  
* askAI();
*/  
  askAI() {
    this.askAIEvent.emit(true);
  }

  /**  
* This is a event to disable ask ai button  .  
* @param {void} empty - A empty param  
* @example  
* disableAskAiButton();
*/  
  disableAskAiButton() {
    this.disableAskAI = true;
    sessionStorage.setItem('askAiSelection', 'true');
  }

/**  
* This is on destroy event subscription.  
* @param {void} empty - A empty param  
* @example  
* ngOnDestroy();
*/  
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
