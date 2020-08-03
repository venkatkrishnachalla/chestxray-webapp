import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from '../../../../service/event-emitter.service';
import { XRayService } from 'src/app/service/x-ray.service';
import { pathology } from 'src/app/constants/pathologyConstants';
import { EllipseData } from 'src/app/module/auth/interface.modal';

@Component({
  selector: 'cxr-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss'],
})
export class FindingsComponent implements OnInit {
  readonly constants = pathology;
  order = [];
  findings: any[];
  item0: any;
  constructor(
    private eventEmitterService: EventEmitterService,
    private xrayAnnotatedService: XRayService
  ) {}

  /*** class init function ***/
  ngOnInit(): void {
    this.findings = [];
    this.getFindings();
  }

  /*** get findings event to subscribe findings from xray image ***/
  getFindings() {
    this.findings = [];
    this.order = this.constants.findings;
    this.order.forEach(data => {
      if (data.Name !== 'ADDITIONAL'){
        this.findings.push(data.Name + ': ');
      }
      else{
        this.findings.push(' ');
      }
    });
    this.eventEmitterService.invokeComponentFindingsData.subscribe(
      (objEllipse: EllipseData) => {
        const index = this.findings.findIndex(item => item.split(':')[0] === objEllipse.split(':')[0]);
        if (index !== -1){
          this.findings.splice(index, 1, objEllipse);
        }
        else{
          if (this.findings[this.findings.length - 1] === ' '){
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

  /*** event to pass findings to report page ***/
  getFindingsToReport() {
    const findings = JSON.stringify(this.findings);
    sessionStorage.setItem('findings', findings);
    this.xrayAnnotatedService.xrayAnnotatedFindings(this.findings);
  }

  updateFindings(evt, index){
    if (evt.target.textContent === ''){
      this.findings.splice(index, 1, ' ');
    }
    else{
      this.findings.splice(index, 1, evt.target.textContent);
    }
  }

  preventBaseValue(evt){
    if (evt.target.textContent[evt.target.textContent.length - 1] === ':') {
      if (evt.key.charCodeAt() === 66){
        evt.preventDefault();
      }
    }
  }
}
