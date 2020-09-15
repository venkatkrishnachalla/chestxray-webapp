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

  /*** PathologyToolComponent class init function ***/
  ngOnInit(): void {}
}
