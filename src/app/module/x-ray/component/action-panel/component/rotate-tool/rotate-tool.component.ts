import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-rotate-tool',
  templateUrl: './rotate-tool.component.html',
  styleUrls: ['./rotate-tool.component.scss'],
})

// RotateToolComponent class implementation
export class RotateToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  actionPanelRotate: { image: string; alt: string; title: string }[];

  /*
   * Constructor for RotateToolComponent class
   */
  constructor() {}

  /*** RotateToolComponent class init function ***/
  ngOnInit(): void {
    this.actionPanelRotate = JSON.parse(
      JSON.stringify(this.constants.actionPanelRotate)
    );
  }
}
