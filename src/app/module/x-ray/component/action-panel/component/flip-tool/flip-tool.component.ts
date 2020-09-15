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

  /*** FlipToolComponent class on init function ***/
  ngOnInit(): void {
    this.actionPanelFit = JSON.parse(
      JSON.stringify(this.constants.actionPanelFlip)
    );
  }
}
