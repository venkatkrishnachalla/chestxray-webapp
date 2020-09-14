import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
// MyAccountComponent class implementation  
export class MyAccountComponent implements OnInit {
  /*  
* constructor for MyAccountComponent class  
*/ 
  constructor() {}
    /**  
 * This is a init function, retrieve current user details.  
 * @param {void} empty - A empty param  
 * @example  
 * ngOnInit();
 */  
  ngOnInit(): void {}
}
