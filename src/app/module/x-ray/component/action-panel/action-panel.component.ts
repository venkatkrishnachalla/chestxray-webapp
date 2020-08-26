import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  OnDestroy
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
  constructor(private eventEmitterService: EventEmitterService) {}

  /*** class init function ***/
  ngOnInit(): void {
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
}
