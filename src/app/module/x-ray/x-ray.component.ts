import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { Subject } from 'rxjs';
import { XRayService } from 'src/app/service/x-ray.service';
import { SpinnerService } from '../shared/UI/spinner/spinner.service';

@Component({
  selector: 'cxr-x-ray',
  templateUrl: './x-ray.component.html',
  styleUrls: ['./x-ray.component.scss'],
})
export class XRayComponent implements OnInit {
  eventsSubject: Subject<any> = new Subject<any>();
  showAskAI = false;
  acceptStatus = false;
  value = 70;
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
  };

  values = 50;
  option: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
  };
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

  constructor(private xrayService: XRayService, private spinnerService: SpinnerService) {}

  ngOnInit(): void {}

  /* open ask ai model when user clicks on ask ai button */
  openAskAI(event: any) {
    // this.showAskAI = !this.showAskAI;
    this.spinnerService.show();
    const PatientImage = localStorage.getItem('PatientImage');
    this.xrayService.getAskAiDetails(PatientImage).subscribe(
      (mLResponse: any) => {
        this.mLResponse = mLResponse;
        this.eventsSubject.next(this.mLResponseNew);
        this.spinnerService.hide();
      },
      (errorMessage: any) => {
        this.spinnerService.hide();
      }
    );
  }

  /* close ask ai model when user clicks on reject button */
  // rejectAI(event: any) {
  //   this.showAskAI = event;
  // }

  /* pass ml predictions data to canvas component */
  // acceptAI(event) {
  //   this.showAskAI = false;
  //   this.acceptStatus = true;
  //   // this.eventsSubject.next(event);
  // }
}
