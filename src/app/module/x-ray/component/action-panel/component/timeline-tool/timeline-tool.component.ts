import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-timeline-tool',
  templateUrl: './timeline-tool.component.html',
  styleUrls: ['./timeline-tool.component.scss'],
})

// TimelineToolComponent class implementation
export class TimelineToolComponent implements OnInit {
  disableActionItems = true;

  /*
   * Constructor for TimelineToolComponent class
   */
  constructor() {}

  /**
   * This is a ngOnInit function
   * @param '{void}' empty- A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {}
}
