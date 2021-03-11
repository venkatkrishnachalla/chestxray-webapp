import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cxr-ask-ai-tool',
  templateUrl: './ask-ai-tool.component.html',
  styleUrls: ['./ask-ai-tool.component.scss'],
})

// AskAiToolComponent class implementation
export class AskAiToolComponent implements OnInit, OnDestroy {
  @Output() askAiEvent = new EventEmitter();
  askAiTitle = 'Already ML Annotations updated';
  disableAskAI: boolean;
  annotationToolCheck: boolean;
  _subscription: Subscription;

  /*
   * Constructor for AskAiToolComponent class
   */
  constructor(private eventEmitterService: EventEmitterService) {
    this.eventEmitterService.invokeAskAiButtonDataFunction.subscribe(
      (askAiEvent: string) => {
        if (askAiEvent === 'success') {
          this.disableAskAiButton();
        }
      }
    );

    this._subscription = this.eventEmitterService.invokePrevNextButtonDataFunction.subscribe(
      (patientId: string) => {
        this.disableAskAI = false;
      }
    );
  }

  /**
   * This is a ngOnInit function
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.annotationToolCheck = JSON.parse(sessionStorage.getItem('annotationTool'));
    const askAiSelection = sessionStorage.getItem('askAiSelection');
    if (askAiSelection === 'true') {
      this.disableAskAI = true;
    }
  }

  /**
   * This is a askAI function, Event to emit canvas image, when click on ask ai button
   * @param '{void}' empty - A empty param
   * @example
   * askAI();
   */
  askAI() {
    this.askAiEvent.emit();
  }

  /**
   * This is a disableAskAiButton function, Event to disable ask ai button after ask ai button click
   * @param '{void}' empty - A empty param
   * @example
   * disableAskAiButton();
   */
  disableAskAiButton() {
    this.disableAskAI = true;
    sessionStorage.setItem('askAiSelection', 'true');
  }

  /*** on destroy event _subscription ***/
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
