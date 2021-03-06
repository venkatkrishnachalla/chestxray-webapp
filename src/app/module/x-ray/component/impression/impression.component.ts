import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  DISEASE_COLOR_MAPPING,
  RANDOM_COLOR,
} from '../../../../constants/findingColorConstants';
import { EventEmitterService } from '../../../../service/event-emitter.service';
import { XRayService } from 'src/app/service/x-ray.service';
import { EllipseData } from 'src/app/module/auth/interface.modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cxr-impression',
  templateUrl: './impression.component.html',
  styleUrls: ['./impression.component.scss'],
})
// ImpressionComponent class implementation
export class ImpressionComponent implements OnInit, OnDestroy {
  impression = [];
  abnormalityColor = [];
  ellipseList = [];
  impressionList = [];
  uniqueImpressions = [];
  _subscription: Subscription;
  impressionsText = 'Impressions';
  hideShowAll: boolean;
  
  /*  
* constructor for ImpressionComponent class  
*/
  constructor(
    private eventEmitterService: EventEmitterService,
    private xrayAnnotatedImpressionService: XRayService
  ) {
    this._subscription = this.eventEmitterService.invokePrevNextButtonDataFunction.subscribe(
      (patientId: string) => {
        this.impression = [];
        this.uniqueImpressions = [];
      }
    );
  }

  /**
   * This is a init function.
   * @param {void} empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    this.hideShowAll = true;
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

  /**
   * function to get impression from xray page
   * @param {void} empty - A empty param
   * @example
   * getImpressions();
   */

  getImpressions() {
    this.eventEmitterService.invokeComponentData.subscribe(
      (obj: { name: any; isMLApi: any; color: any }) => {
        const index = this.impression.findIndex((a) => a.id === '00');
        if (index !== -1) {
          this.impression.splice(index, 1);
        }
        this.impression.push(obj);
        this.uniqueImpressionsData();
        this.getColorMapping(obj.name, obj.isMLApi, obj.color);
      }
    );
    this.eventEmitterService.invokeComponentEllipseData.subscribe(
      (objEllipse: EllipseData) => {
        this.ellipseList.push(objEllipse);
      }
    );
    const impression = JSON.parse(sessionStorage.getItem('impression'));
    this.uniqueImpressions = impression;
  }

  /**
   * function to filter unique impressions
   * @param {void} empty - A empty param
   * @example
   * uniqueImpressionsData();
   */

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
          checked: true
        });
      }
      return null;
    });
    const event = {target: { checked : true}};
    this.hideorShowAllFun(event);
    this.updateFindings();
  }

  /**
   * delete impression function
   * @param {string} value - A string param
   * @param {string} value - A string param
   * @param {number} index - A number param
   * @example
   * deleteImpression(id, disease, objectindex);
   */

  deleteImpression(id: number, disease: string, objectindex: number) {
    const index = this.impression.findIndex((item) => item.id === id);
    this.impression.splice(index, 1);
    this.uniqueImpressionsData();
    this.impression.forEach((obj) => {
      this.getColorMapping(obj.name, obj.isMLApi, obj.color);
    });
  }

  /**
   * function to update findings
   * @param {void} empty - A empty param
   * @example
   * updateFindings();
   */

  updateFindings() {
    this.eventEmitterService.onImpressionDataShared(this.impression);
  }

  /**
   * function to update impression
   * @param {string} value - A string param
   * @example
   * updateImpression(info);
   */

  updateImpression(info) {
    const index = this.impression.findIndex((item) => item.id === info.id);
    this.impression.splice(index, 1, { id: info.id, name: info.name });
    this.abnormalityColor = [];
    this.impression.forEach((obj) => {
      this.getColorMapping(obj.name, obj.isMLApi, obj.color);
    });
    this.uniqueImpressionsData();
  }

  /**
   * function to update color code to impression list
   * @param {string} value - A string param
   * @param {string} value - A string param
   * @param {string} value - A string param
   * @example
   * getColorMapping(diseases, isMLApi, impcolor);
   */
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

  /**  
   * unction to pass impressions list to report page
   * @param {void} empty - A empty param 
   * @example  
   * getImpressionsToReport();
   */
  getImpressionsToReport() {
    const impression = JSON.stringify(this.impression);
    sessionStorage.setItem('impression', impression);
    this.xrayAnnotatedImpressionService.xrayAnnotatedImpressions(
      this.uniqueImpressions
    );
  }
  /**  
   * function to pass impressions list to report page
   * @param {void} empty - A empty param 
   * @example  
   * displayFun();
   */
  displayFun(data, event, index){
    this.uniqueImpressions[index].checked = event.target.checked;
    if (!event.target.checked){
      let count = 0;
      this.uniqueImpressions.forEach(element => {
        if (element.checked){
          count++;
        }
      });
      if (count === 0){
        this.hideShowAll = false;
      }
    }
    else{
      this.hideShowAll = true;
    }
    this.eventEmitterService.onImpressionCheckboxClick({info: data, check: event.target.checked, title: 'Single'});
  }

  /**  
   * function to pass impressions list to report page
   * @param {void} empty - A empty param 
   * @example  
   * displayFun();
   */
  hideorShowAllFun(event){
    if (event.target.checked){
      this.hideShowAll = true;
      this.uniqueImpressions.forEach(element => {
        element.checked = true;
      });
    }
    else{
      this.hideShowAll = false;
      this.uniqueImpressions.forEach(element => {
        element.checked = false;
      });
    }
    this.eventEmitterService.onImpressionCheckboxClick({check: event.target.checked, title: 'All'});
  }

  /*** on destroy event subscription ***/
  
 /**  
  * on destroy event subscription 
  * @param {void} empty - A empty param 
  * @example  
  * ngOnDestroy();
  */
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
