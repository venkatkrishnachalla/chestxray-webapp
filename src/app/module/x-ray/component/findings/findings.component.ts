import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from '../../../../service/event-emitter.service';
import { DISEASE_COLOR_MAPPING } from '../../../../constants/findingColorConstants';

@Component({
  selector: 'cxr-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss'],
})
export class FindingsComponent implements OnInit {
  constructor(private eventEmitterService: EventEmitterService) {}
  findings = [
    'Lungs are clear, no evidence of pulmonary parenchymal masses or consolidations.',
    'Normal hilar vascular markings.',
    'Both costophrenic angles are clear.',
    'There is cardiomegaly.',
    'The mediastinum is within normal limits.',
  ];

  ngOnInit(): void {
    this.findings = [];
    this.getFindings();
  }

  getFindings() {}
}
