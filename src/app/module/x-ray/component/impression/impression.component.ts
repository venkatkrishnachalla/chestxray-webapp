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
  impression = [];
  abnormalityColor = [];
  constructor(private eventEmitterService: EventEmitterService) {}

  ngOnInit(): void {
    this.getImpressions();
    this.eventEmitterService.invokeComponentFunction.subscribe(
      (info: object) => {
        switch (info['check']) {
          case 'delete':
            this.deleteImpression(info['id']);
            break;
          case 'update':
            this.updateImpression(info);
            break;
          case 'report':
            this.getImpressionsToReport();
            break;
          default:
            break;
        }
      }
    );
  }

  getImpressions() {
    this.eventEmitterService.invokeComponentData.subscribe((obj) => {
      this.impression.push(obj);
      this.getColorMapping(obj.name);
    });
  }

  deleteImpression(id) {
    let index = this.impression.findIndex((item) => item.id == id);
    this.impression.splice(index, 1);
    this.abnormalityColor = [];
    this.impression.forEach((obj) => {
      this.getColorMapping(obj.name);
    });
  }

  updateImpression(info) {
    let index = this.impression.findIndex((item) => item.id == info.id);
    this.impression.splice(index, 1, { id: info.id, name: info.name });
  }

  getColorMapping(diseases) {
    const color = DISEASE_COLOR_MAPPING[diseases] || RANDOM_COLOR;
    this.abnormalityColor.push(color);
  }

  getImpressionsToReport() {
    this.eventEmitterService.xrayAnnotatedImpressions(this.impression);
  }
}
