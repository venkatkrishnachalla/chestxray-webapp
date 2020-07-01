import { Component, OnInit } from '@angular/core';
import {
  DISEASE_COLOR_MAPPING,
  RANDOM_COLOR,
} from '../../../../constants/findingColorConstants';
import { EventEmitterService } from '../../../../service/event-emitter.service';

@Component({
  selector: 'cxr-impression',
  templateUrl: './impression.component.html',
  styleUrls: ['./impression.component.scss'],
})
export class ImpressionComponent implements OnInit {
  impression = [
    // 'Cyst with Air Crescent',
    // 'Cardiomegaly',
    // 'others',
    // 'Bronchiectasis',
  ];
  abnormalityColor = [];
  constructor(private eventEmitterService: EventEmitterService) {}

  ngOnInit(): void {
    this.getImpressions();
  }

  getImpressions() {
    this.eventEmitterService.invokeComponentData.subscribe((title) => {
      this.impression.push(title);
      this.getColorMapping(title);
    });
  }

  getColorMapping(diseases) {
    // diseases.forEach((element) => {
    const color = DISEASE_COLOR_MAPPING[diseases] || RANDOM_COLOR;
    this.abnormalityColor.push(color);
    // });
  }
}
