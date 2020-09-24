import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import User from '../../auth/user.modal';
@Component({
  selector: 'cxr-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
// DashboardComponent class implementation  
export class DashboardComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  isHospitalRadiologist: boolean;
  isAdmin: boolean;
/*  
* constructor for DashboardComponent class  
*/ 
  constructor(private authService: AuthService) {}

   /**  
 * This is a init function, retrieve current user details.  
 * @param {void} empty - A empty param  
 * @example  
 * ngOnInit();
 */  
  ngOnInit(): void {
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.isHospitalRadiologist =
          user.userroles[0] === 'HospitalRadiologist' ? true : false;
          this.isAdmin = user.userroles[0] === 'Admin' ? true : false;
        }
      }
    );
  }

  /*** unsubscribe userSubscription event ***/
     /**  
 * This is a unsubscribe userSubscription event.  
 * @param {void} empty - A empty param  
 * @example  
 * ngOnDestroy();
 */  
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
