import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { EventEmitterService2 } from '../../../../service/event-emitter.service2';
@Component({
  selector: 'cxr-report-footer',
  templateUrl: './report-footer.component.html',
  styleUrls: ['./report-footer.component.scss'],
})
// ReportFooterComponent class implementation
export class ReportFooterComponent implements OnInit {
  signature: any;
  signedDate: any;
  @Output() printEvent = new EventEmitter();
  /*
   * constructor for ReportFooterComponent class
   */
  constructor(
    private eventEmitterService2 : EventEmitterService2,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.eventEmitterService2.oneSignatureChanges.subscribe((data) => {
      this.signature = data.img;
      this.signedDate = data.date;
      this.changeDetector.markForCheck();
      this.printEvent.emit(true);
    });
  }

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
  }
}
