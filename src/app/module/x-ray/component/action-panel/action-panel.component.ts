import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  OnDestroy,
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
  constructor(private eventEmitterService: EventEmitterService) {}

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {}

  /**
   * This is a icon click event & changing active icon function.
   * @param '{any}' data - A array param
   * @param '{number}' index - A number param
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
   * @param '{void}' empty - A empty param
   * @example
   * askAI();
   */
  askAI() {
    this.askAIEvent.emit(true);
  }
}
