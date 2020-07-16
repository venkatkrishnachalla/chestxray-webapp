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
  findings: any[];
  impressions: any[];
  mLResponse: any[];
  mLResponseNew = {
    data: {
      names: [],
      ndarray: [
        {
          Findings: {
            ADDITIONAL: [],
            'BONY THORAX': [],
            'CARDIAC SILHOUETTE': [],
            COSTOPHRENIC_ANGLES: [],
            'DOMES OF DIAPHRAGM': [],
            'HILAR/MEDIASTINAL': [],
            'LUNG FIELDS': [0, 1],
          },
          Impression: [
            [0, 'calcification'],
            [1, 'consolidation'],
          ],
          diseases: [
            {
              color: 'rgb(230,25,75)',
              confidence: 0.9941253662109375,
              contours: [],
              ellipses: [
                {
                  a: 253,
                  b: 453,
                  r: 0,
                  x: 946,
                  y: 348,
                },
              ],
              idx: 0,
              name: 'Calcification',
            },
            {
              color: 'rgb(60,180,75)',
              confidence: 0.9983514547348022,
              contours: [],
              ellipses: [
                {
                  a: 153,
                  b: 353,
                  r: 0,
                  x: 716,
                  y: 278,
                },
              ],
              idx: 1,
              name: 'Consolidation',
            },
          ],
        },
      ],
    },
    meta: {},
  };

  constructor(private xrayService: XRayService) {}

  ngOnInit(): void {
    const PatientImage = localStorage.getItem('PatientImage');
    /* post request to ml api to get prediction data */
    this.xrayService.getAskAiDetails(PatientImage, '').subscribe(
      (mLResponse: any) => {
        this.mLResponse = mLResponse;
      },
      (errorMessage: any) => {}
    );
  }

  /* pass ml response to xray component, when user clicks accept */
  acceptAI() {
    this.acceptAiEvent.emit(this.mLResponseNew);
  }

  /* pass false value to xray component, when user clicks reject */
  rejectAI() {
    this.rejectAiEvent.emit(false);
  }
}
