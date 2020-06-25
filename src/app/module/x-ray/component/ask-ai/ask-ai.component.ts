import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { findingsAndImpression } from 'src/app/constants/findingsAndImpression';

@Component({
  selector: 'cxr-ask-ai',
  templateUrl: './ask-ai.component.html',
  styleUrls: ['./ask-ai.component.scss']
})
export class AskAiComponent implements OnInit {
  @Output() rejectAiEvent = new EventEmitter();
  readonly constants = findingsAndImpression;
  finding: { text: string; }[];
  impression: { name: string; }[];
  constructor() {}

  ngOnInit(): void {
    this.finding = this.constants.findings;
    this.impression = this.constants.impressions;
  }

  rejectAI() {
    this.rejectAiEvent.emit(false);
  }

}
