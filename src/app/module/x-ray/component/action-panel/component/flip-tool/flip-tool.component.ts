import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-flip-tool',
  templateUrl: './flip-tool.component.html',
  styleUrls: ['./flip-tool.component.scss'],
})

// FlipToolComponent class implementation
export class FlipToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  actionPanelFit: { image: string; alt: string; title: string }[];

  /*
   * Constructor for FlipToolComponent class
   */
  constructor() {}

  /**
   * This is a ngOnInit function
   * @param '{void}' empty- A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.actionPanelFit = JSON.parse(
      JSON.stringify(this.constants.actionPanelFlip)
    );
  }
}
