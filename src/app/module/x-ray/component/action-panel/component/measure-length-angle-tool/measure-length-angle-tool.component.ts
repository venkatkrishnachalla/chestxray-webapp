import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

@Component({
  selector: 'cxr-measure-length-angle-tool',
  templateUrl: './measure-length-angle-tool.component.html',
  styleUrls: ['./measure-length-angle-tool.component.scss'],
})

// MeasureLengthAngleToolComponent class implementation
export class MeasureLengthAngleToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  lengthAnglePanel: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];

  /*
   * Constructor for MeasureLengthAngleToolComponent class
   */
  constructor(private eventEmitterService: EventEmitterService) {
    this.eventEmitterService.onInActiveIconFunction.subscribe(
      (data: string) => {
      if (data === 'Draw Ellipse' || data === 'Free Hand Drawing') {
        this.lengthAnglePanel.forEach((element: any) => {
          element.active = false;
        });
      }
    });
  }

  /**
   * This is a ngOnInit function
   * @param '{void}' empty- A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.lengthAnglePanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelLengthAngle)
    );
  }

  /**
   * This is a iconAction click function.
   * @param '{void}' empty- A empty param
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
