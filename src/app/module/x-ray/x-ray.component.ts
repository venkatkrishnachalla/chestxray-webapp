import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { Subject } from 'rxjs';

@Component({
  selector: 'cxr-x-ray',
  templateUrl: './x-ray.component.html',
  styleUrls: ['./x-ray.component.scss'],
})
export class XRayComponent implements OnInit {
  eventsSubject: Subject<void> = new Subject<void>();
  showAskAI = false;
  acceptStatus = false;
  value = 70;
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
  };

  values = 50;
  option: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
  };

  ngOnInit(): void {}

  /* open ask ai model when user clicks on ask ai button */
  openAskAI(event: any) {
    this.showAskAI = !this.showAskAI;
  }

  /* close ask ai model when user clicks on reject button */
  rejectAI(event: any) {
    this.showAskAI = event;
  }

  /* pass ml predictions data to canvas component */
  acceptAI(event) {
    this.showAskAI = false;
    this.acceptStatus = true;
    this.eventsSubject.next(event);
  }
}
