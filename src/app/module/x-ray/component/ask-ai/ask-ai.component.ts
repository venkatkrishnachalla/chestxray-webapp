import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { findingsAndImpression } from 'src/app/constants/findingsAndImpression';
import { XRayService } from 'src/app/service/x-ray.service';

interface MlApiData {
  data: any[];
}
@Component({
  selector: 'cxr-ask-ai',
  templateUrl: './ask-ai.component.html',
  styleUrls: ['./ask-ai.component.scss'],
})
// AskAiComponent class implementation
export class AskAiComponent implements OnInit {
  @Output() acceptAiEvent = new EventEmitter();
  @Output() rejectAiEvent = new EventEmitter();
  @Input() isDisableAccept;
  readonly constants = findingsAndImpression;
  mLResponse;
  findings = [];
  impressions = [];

  /*
   * constructor for AskAiComponent class
   */
  constructor(private xrayService: XRayService) {}

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    const PatientImage = sessionStorage.getItem('PatientImage');
    /* post request to ml api to get prediction data */
    this.xrayService.getAskAiDetails(PatientImage, '').subscribe(
      (mLResponse: MlApiData) => {
        this.mLResponse = mLResponse;
      },
      (errorMessage: string) => {}
    );
  }

  /**
   * This is a pass ml response to xray component, when user clicks accept.
   * @param '{void}' empty - A empty param
   * @example
   * acceptAI();
   */

  acceptAI() {
    this.acceptAiEvent.emit('');
  }

  /**
   * This is a pass false value to xray component, when user clicks reject.
   * @param '{void}' empty - A empty param
   * @example
   * rejectAI();
   */

  rejectAI() {
    this.rejectAiEvent.emit(false);
  }
}
