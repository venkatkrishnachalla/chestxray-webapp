import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

@Component({
  selector: 'cxr-pathology-tool',
  templateUrl: './pathology-tool.component.html',
  styleUrls: ['./pathology-tool.component.scss'],
})

// PathologyToolComponent class implementation
export class PathologyToolComponent implements OnInit {
  disableActionItems: boolean;
  buttonActive: boolean;
  /*
   * Constructor for PathologyToolComponent class
   */
  constructor(private eventEmitterService: EventEmitterService) {}

  /**
   * This is a ngOnInit function
   * @param '{void}' empty- A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.disableActionItems = false;
    this.buttonActive = false;
  }

  pathologyClicked() {
    const data = {
      active: !this.buttonActive,
      alt: '',
      image: '',
      implemented: true,
      title: 'pathology'
    };
    this.eventEmitterService.onComponentButtonClick(data);
  }
}
