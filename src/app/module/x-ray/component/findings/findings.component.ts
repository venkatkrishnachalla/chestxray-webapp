import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from '../../../../service/event-emitter.service';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss'],
})
export class FindingsComponent implements OnInit {
  constructor(
    private eventEmitterService: EventEmitterService,
    private xrayAnnotatedService: XRayService
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
    this.xrayAnnotatedService.xrayAnnotatedFindings(this.findings);
  }
}
