import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from '../../../../service/event-emitter.service';
import { XRayService } from 'src/app/service/x-ray.service';
import { pathology } from 'src/app/constants/pathologyConstants';
import { EllipseData } from 'src/app/module/auth/interface.modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cxr-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss'],
})
// FindingsComponent class implementation
export class FindingsComponent implements OnInit, OnDestroy {
  readonly constants = pathology;
  order = [];
  findings: any[];
  findingsText: string;
  item0: any;
  _subscription: Subscription;

  /*
   * constructor for FindingsComponent class
   */

  constructor(
    private eventEmitterService: EventEmitterService,
    private xrayAnnotatedService: XRayService
  ) {
    this._subscription = this.eventEmitterService.invokePrevNextButtonDataFunction.subscribe(
      (patientId: string) => {
        this.findings = [];
        this.getFindings();
      }
    );
  }

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    this.findingsText = 'Findings';
    this.findings = [];
    this.getFindings();
  }

  /**
   * get findings event to subscribe findings from xray image
   * @param '{void}' empty - A empty param
   * @example
   * getFindings();
   */

  getFindings() {
    this.findings = [];
    this.order = this.constants.findings;
    this.order.forEach((data) => {
      if (data.Name !== 'ADDITIONAL') {
        this.findings.push(data.Name + ':');
      } else {
        this.findings.push(' ');
      }
    });
    this.eventEmitterService.invokeComponentFindingsData.subscribe(
      (objEllipse: EllipseData) => {
        const index = this.findings.findIndex(
          (item) => item.split(':')[0] === objEllipse.split(':')[0]
        );
        if (index !== -1) {
          this.findings.splice(index, 1, objEllipse);
        } else {
          if (this.findings[this.findings.length - 1] === ' ') {
            this.findings.splice(-1);
          }
          this.findings.push(objEllipse);
        }
      }
    );
    // this.eventEmitterService.invokeFindingsDataFunction.subscribe((data) => {
    //   const uniqueImpressions = [];
    //   data.filter((item) => {
    //     const i = uniqueImpressions.findIndex((x) => x.name === item.name);
    //     if (i <= -1) {
    //       uniqueImpressions.push({ id: item.id, name: item.name });
    //     }
    //     return null;
    //   });
    //   if (this.findings.length !== 0) {
    //     this.findings.forEach((element, index) => {
    //       const result = uniqueImpressions.findIndex(
    //         (ele) => ele.name === element.split(':')[1].trim()
    //       );
    //       if (result === -1) {
    //         const desc = this.order.findIndex(
    //           (a) => a.Name === element.split(':')[0]
    //         );
    //         if (element.split(':')[1].split(',').length === 1) {
    //           this.findings.splice(
    //             index,
    //             1,
    //             element.split(':')[0] + ': ' + this.order[desc].Desc
    //           );
    //         } else {
    //           element
    //             .split(':')[1]
    //             .split(',')
    //             .forEach((newEle) => {
    //               const result2 = uniqueImpressions.findIndex(
    //                 (ele) => ele.name === newEle.trim()
    //               );
    //               if (result2 === -1) {
    //                 const newResult = element
    //                   .split(':')[1]
    //                   .split(',')
    //                   .filter((item) => item !== newEle);
    //                 this.findings.splice(
    //                   index,
    //                   1,
    //                   element.split(':')[0] + ': ' + newResult.join(',')
    //                 );
    //               }
    //             });
    //         }
    //       }
    //     });
    //   }
    // });
  }

  /**
   * event to pass findings to report page
   * @param '{void}' empty - A empty param
   * @example
   * getFindingsToReport();
   */

  getFindingsToReport() {
    const findings = JSON.stringify(this.findings);
    sessionStorage.setItem('findings', findings);
    this.xrayAnnotatedService.xrayAnnotatedFindings(this.findings);
  }

  /**
   * This is a updateFindings function
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   *   updateFindings(evt, index);
   */

  updateFindings(evt, index) {
    if (evt.target.textContent === '') {
      this.findings.splice(index, 1, ' ');
    } else {
      this.findings.splice(index, 1, evt.target.textContent);
      const findings = JSON.stringify(this.findings);
      sessionStorage.setItem('findings', findings);
    }
  }

  /**
   * This is a preventBaseValue function
   * @param '{string}' value - A string param
   * @example
   *   preventBaseValue(evt);
   */

  preventBaseValue(evt) {
    const lengthIndex = evt.target.textContent.indexOf(':');
    if (lengthIndex !== -1) {
      if (window.getSelection().getRangeAt(0).startOffset > lengthIndex) {
        if (evt.target.textContent[evt.target.textContent.length - 1] === ':') {
          if (evt.which === 8) {
            evt.preventDefault();
          }
        } else {
          if (
            window.getSelection().getRangeAt(0).startOffset ===
            lengthIndex + 1
          ) {
            if (evt.which === 68) {
              return true;
            }
            return false;
          } else if (evt.which === 46) {
            return true;
          }
        }
      } else {
        return false;
      }
    }
  }

  /**
   * on destroy event subscription
   * @param '{void}' empty - A empty param
   * @example
   *   ngOnDestroy();
   */

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
