import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from "../../../../service/event-emitter.service";

@Component({
  selector: 'cxr-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss'],
})
export class FindingsComponent implements OnInit {
  findings: any;
  constructor(
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.findings = [];
    this.getFindings();
  }

  getFindings(){
    this.eventEmitterService.invokeComponentData.subscribe((title) => {  
        this.findings.push(title);
      });    
  }
}
