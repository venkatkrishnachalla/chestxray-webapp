import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

@Component({
  selector: 'cxr-zoomin-zoomout-tool',
  templateUrl: './zoomin-zoomout-tool.component.html',
  styleUrls: ['./zoomin-zoomout-tool.component.scss'],
})

// ZoominZoomoutToolComponent class implementation
export class ZoominZoomoutToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  actionPanelZoom: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];

  /*
   * Constructor for ZoominZoomoutToolComponent class
   */
  constructor(private eventEmitterService: EventEmitterService) {}

  /*** ZoominZoomoutToolComponent class on init function ***/
  ngOnInit(): void {
    this.actionPanelZoom = JSON.parse(
      JSON.stringify(this.constants.actionPanelZoomInZoomOut)
    );
  }

  /**
   * This is a iconAction click function.
   * @example
   * iconAction(data , index);
   */
  iconAction(data, index) {
    for (const key in data) {
      // tslint:disable-next-line: radix
      if (parseInt(key) !== index) {
        data[key].active = false;
      }
    }
    data[index].active = data[index].active ? false : true;
    this.eventEmitterService.onComponentButtonClick(data[index]);
  }
}
