import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-zoomin-zoomout-tool',
  templateUrl: './zoomin-zoomout-tool.component.html',
  styleUrls: ['./zoomin-zoomout-tool.component.scss'],
})

// ZoominZoomoutToolComponent class implementation
export class ZoominZoomoutToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  actionPanelZoom: { image: string; alt: string; title: string }[];

  /*
   * Constructor for ZoominZoomoutToolComponent class
   */
  constructor() {}

  /*** ZoominZoomoutToolComponent class on init function ***/
  ngOnInit(): void {
    this.actionPanelZoom = JSON.parse(
      JSON.stringify(this.constants.actionPanelZoomInZoomOut)
    );
  }
}
