import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'cxr-x-ray',
  templateUrl: './x-ray.component.html',
  styleUrls: ['./x-ray.component.scss'],
})
export class XRayComponent implements OnInit {
  showAskAI = false;
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

  ngOnInit(): void {
  }

  openAskAI(event) {
    this.showAskAI = !this.showAskAI;
  }

  rejectAI(event) {
    this.showAskAI = event;
  }
}
