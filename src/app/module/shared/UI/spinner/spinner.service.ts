import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// SpinnerService class implementation  
export class SpinnerService {
  /*  
* constructor for SpinnerService class  
*/ 
  constructor() {}

  private isLoading = new BehaviorSubject<boolean>(false);

  /**  
* This is a show function.  
* @param {void} empty - A empty param  
* @example  
* show();
*/ 
  show() {
    this.isLoading.next(true);
  }

/**  
* This is a hide function.  
* @param {void} empty - A empty param  
* @example  
* hide();
*/ 
  hide() {
    this.isLoading.next(false);
  }

/**  
* This is a getLoaderData function.  
* @param {void} empty - A empty param  
* @example  
* getLoaderData();
*/ 
  getLoaderData() {
    return this.isLoading.asObservable();
  }
}
