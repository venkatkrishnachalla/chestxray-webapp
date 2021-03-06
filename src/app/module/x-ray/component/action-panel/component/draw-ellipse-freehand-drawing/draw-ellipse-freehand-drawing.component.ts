import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

@Component({
  selector: 'cxr-draw-ellipse-freehand-drawing',
  templateUrl: './draw-ellipse-freehand-drawing.component.html',
  styleUrls: ['./draw-ellipse-freehand-drawing.component.scss'],
})

// DrawEllipseFreehandDrawingComponent class implementation
export class DrawEllipseFreehandDrawingComponent implements OnInit {
  readonly constants = actionPanelConstants;
  ellipseFreeHandPanel: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];

  /*
   * Constructor for DrawEllipseFreehandDrawingComponent class
   */
  constructor(private eventEmitterService: EventEmitterService) {}

  /*** DrawEllipseFreehandDrawingComponent class init function ***/
  ngOnInit(): void {
    this.ellipseFreeHandPanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelEllipseFreeHand)
    );
  }

  /**
   * This is a iconAction click function.
   * @example
   * iconAction([ellipse] , 1);
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
