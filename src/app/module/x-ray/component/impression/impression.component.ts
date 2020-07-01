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
      this.eventEmitterService.invokeComponentFunction.subscribe(
        (title: object) => {
          switch (title['name']) {
            case 'delete':
              this.deleteImpression(title['id']);
              break;
            case 'update':
              this.updateImpression();
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

  deleteImpression(id){
    let index = this.impression.findIndex(item => item.id == id);
    this.impression.splice(index,1);
  }

  updateImpression(){

  }

  getColorMapping(diseases) {
    // diseases.forEach((element) => {
    const color = DISEASE_COLOR_MAPPING[diseases] || RANDOM_COLOR;
    this.abnormalityColor.push(color);
    // });
  }
}
