import { Component, OnInit } from '@angular/core';
import {
  DISEASE_COLOR_MAPPING,
  RANDOM_COLOR,
} from '../../../../constants/findingColorConstants';

@Component({
  selector: 'cxr-impression',
  templateUrl: './impression.component.html',
  styleUrls: ['./impression.component.scss'],
})
export class ImpressionComponent implements OnInit {
  impression = [
    'Cyst with Air Crescent',
    'Cardiomegaly',
    'others',
    'Bronchiectasis',
  ];
  abnormalityColor = [];
  constructor() {}

  ngOnInit(): void {
    this.getColorMapping(this.impression);
  }

  getColorMapping(diseases) {
    diseases.forEach((element) => {
      const color = DISEASE_COLOR_MAPPING[element] || RANDOM_COLOR;
      this.abnormalityColor.push(color);
    });
  }
}
