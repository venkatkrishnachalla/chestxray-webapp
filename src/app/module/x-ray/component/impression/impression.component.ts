import { Component, OnInit } from '@angular/core';
import {
  DISEASE_COLOR_MAPPING,
  RANDOM_COLOR,
} from '../../../../constants/findingColorConstants';
import { EventEmitterService } from '../../../../service/event-emitter.service';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-impression',
  templateUrl: './impression.component.html',
  styleUrls: ['./impression.component.scss'],
})
export class ImpressionComponent implements OnInit {
  impression = [];
  abnormalityColor = [];
  ellipseList = [];
  impressionList = [];
  uniqueImpressions = [];
  constructor(
    private eventEmitterService: EventEmitterService,
    private xrayAnnotatedImpressionService: XRayService
  ) {}

  ngOnInit(): void {
    this.getImpressions();
    this.eventEmitterService.invokeComponentFunction.subscribe(
      (info: { check: any; id: any; disease: any; objectindex: any }) => {
        switch (info.check) {
          case 'delete':
            this.deleteImpression(info.id, info.disease, info.objectindex);
            break;
          case 'update':
            this.updateImpression(info);
            break;
          default:
            break;
        }
      }
    );
  }

  getImpressions() {
    this.eventEmitterService.invokeComponentData.subscribe(
      (obj: { name: any; isMLApi: any; color: any }) => {
        this.impression.push(obj);
        this.uniqueImpressionsData();
      }
    );
    this.eventEmitterService.invokeComponentEllipseData.subscribe(
      (objEllipse: any) => {
        this.ellipseList.push(objEllipse);
      }
    );
    const impression = JSON.parse(sessionStorage.getItem('impression'));
    this.uniqueImpressions = impression;
  }

  uniqueImpressionsData() {
    this.uniqueImpressions = [];
    this.impression.filter((item) => {
      let color;
      if (item.isMLApi) {
        color = item.color;
      } else {
        color = DISEASE_COLOR_MAPPING[item.name.toLowerCase()] || RANDOM_COLOR;
      }
      const i = this.uniqueImpressions.findIndex((x) => x.name === item.name);
      if (i <= -1) {
        this.uniqueImpressions.push({
          id: item.id,
          name: item.name,
          colors: color,
        });
      }
      return null;
    });
    this.updateFindings();
  }

  deleteImpression(id: number, disease: string, objectindex: number) {
    const index = this.impression.findIndex((item) => item.id === id);
    this.impression.splice(index, 1);
    this.uniqueImpressionsData();
    this.impression.forEach((obj) => {
      this.getColorMapping(obj.name, obj.isMLApi, obj.color);
    });
  }

  updateFindings() {
    this.eventEmitterService.onImpressionDataShared(this.impression);
  }

  updateImpression(info) {
    const index = this.impression.findIndex((item) => item.id === info.id);
    this.impression.splice(index, 1, { id: info.id, name: info.name });
    this.abnormalityColor = [];
    this.impression.forEach((obj) => {
      this.getColorMapping(obj.name, obj.isMLApi, obj.color);
    });
    this.uniqueImpressionsData();
  }

  getColorMapping(diseases: string, isMLApi: string, impcolor: string) {
    this.abnormalityColor = [];
    if (isMLApi) {
      const color = impcolor;
      this.abnormalityColor.push(color);
    } else {
      const color =
        DISEASE_COLOR_MAPPING[diseases.toLowerCase()] || RANDOM_COLOR;
    }
  }

  getImpressionsToReport() {
    const impression = JSON.stringify(this.impression);
    sessionStorage.setItem('impression', impression);
    this.xrayAnnotatedImpressionService.xrayAnnotatedImpressions(
      this.uniqueImpressions
    );
  }
}
