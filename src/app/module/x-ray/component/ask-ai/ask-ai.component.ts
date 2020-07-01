import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { findingsAndImpression } from 'src/app/constants/findingsAndImpression';
import { XRayService } from 'src/app/service/x-ray.service';

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
  finding: { text: string }[];
  impression: { name: string }[];
  mLResponse = [
    {
      color: 'rgb(60,180,75)',
      coordA: 253,
      coordAngle: 0,
      coordB: 453,
      coordX: 946,
      coordY: 348,
      diseases: 'Consolidation',
      id: 0,
    },
    {
      color: 'rgb(230,25,75)',
      coordA: 153,
      coordAngle: 0,
      coordB: 353,
      coordX: 716,
      coordY: 278,
      diseases: 'Calcification',
      id: 1,
    },
  ];
  constructor(private xrayService: XRayService) {}

  ngOnInit(): void {
    this.finding = this.constants.findings;
    this.impression = this.constants.impressions;
    const PatientImage = sessionStorage.getItem('PatientImage');
    /* post request to ml api to get prediction data */
    this.xrayService.getAskAiDetails(PatientImage).subscribe(
      (mLResponse: any) => {
        this.mLResponse = mLResponse;
      },
      (errorMessage: any) => {}
    );
  }

  /* pass ml response to xray component, when user clicks accept */
  acceptAI() {
    this.acceptAiEvent.emit(this.mLResponse);
  }

  /* pass false value to xray component, when user clicks reject */
  rejectAI() {
    this.rejectAiEvent.emit(false);
  }
}
