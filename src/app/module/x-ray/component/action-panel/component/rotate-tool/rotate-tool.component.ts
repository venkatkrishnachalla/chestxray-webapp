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

  /**
   * This is a ngOnInit function
   * @param '{void}' empty- A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.actionPanelRotate = JSON.parse(
      JSON.stringify(this.constants.actionPanelRotate)
    );
  }
}
