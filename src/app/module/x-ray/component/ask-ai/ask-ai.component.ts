import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { findingsAndImpression } from 'src/app/constants/findingsAndImpression';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-ask-ai',
  templateUrl: './ask-ai.component.html',
  styleUrls: ['./ask-ai.component.scss'],
})
export class AskAiComponent implements OnInit {
  @Output() rejectAiEvent = new EventEmitter();
  readonly constants = findingsAndImpression;
  finding: { text: string }[];
  impression: { name: string }[];

  constructor(private xrayService: XRayService) {}

  ngOnInit(): void {
    this.finding = this.constants.findings;
    this.impression = this.constants.impressions;
    const PatientImage = sessionStorage.getItem('PatientImage');
    this.xrayService.getAskAiDetails(PatientImage).subscribe(
      (imageResponse: any) => {
      },
      (errorMessage: any) => {}
    );
  }

  rejectAI() {
    this.rejectAiEvent.emit(false);
  }
}
