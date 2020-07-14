import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from '../../../../service/event-emitter.service';
import { DISEASE_COLOR_MAPPING } from '../../../../constants/findingColorConstants';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss'],
})
export class FindingsComponent implements OnInit {
  constructor(
    private eventEmitterService: EventEmitterService,
    private xrayAnnotatedImpressionService: XRayService
  ) {}
  findings: any[];

  ngOnInit(): void {
    this.findings = [];
    this.getFindings();
  }

  getFindings() {
    this.eventEmitterService.invokeComponentFindingsData.subscribe(
      (objEllipse) => {
        this.findings.push(objEllipse);
      }
    );
  }

  getFindingsToReport() {
    this.xrayAnnotatedImpressionService.xrayAnnotatedFindings(this.findings);
  }
}
