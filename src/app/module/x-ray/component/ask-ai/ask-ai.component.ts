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
export class AskAiComponent implements OnInit {
  @Output() acceptAiEvent = new EventEmitter();
  @Output() rejectAiEvent = new EventEmitter();
  @Input() isDisableAccept;
  readonly constants = findingsAndImpression;
  mLResponse;
  findings = [];
  impressions = [];

  constructor(private xrayService: XRayService) {}

  /*** class init function ***/
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

  /* pass ml response to xray component, when user clicks accept */
  acceptAI() {
    this.acceptAiEvent.emit('');
  }

  /* pass false value to xray component, when user clicks reject */
  rejectAI() {
    this.rejectAiEvent.emit(false);
  }
}
