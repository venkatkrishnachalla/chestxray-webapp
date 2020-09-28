import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-pathology-tool',
  templateUrl: './pathology-tool.component.html',
  styleUrls: ['./pathology-tool.component.scss'],
})

// PathologyToolComponent class implementation
export class PathologyToolComponent implements OnInit {
  disableActionItems = true;

  /*
   * Constructor for PathologyToolComponent class
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
