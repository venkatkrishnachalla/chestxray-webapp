import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { AuthService } from 'src/app/module/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import User from 'src/app/module/auth/user.modal';

@Component({
  selector: 'cxr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
// HeaderComponent class implementation  
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  isAuth = false;
  doctorName: string;
  toggleActive: boolean;
  userroles: string;

  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() addRadiologist: EventEmitter<string> = new EventEmitter<string>();
    /*  
    * constructor for HeaderComponent class  
    */  
  constructor(private authService: AuthService, public router: Router) {}

  /**  
 * This is a class init function.  
 * @param {void} empty - A empty param  
 * @example  
 * ngOnInit();
 */  
  ngOnInit(): void {
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.doctorName = user.username;
          this.userroles = user.userroles[0];
          console.log(user);
        }
      }
    );
    this.toggleActive = false;
    this.initialize();
  }

  /**  
 * This is a initialize function to check isAuth.  
 * @param {void} empty - A empty param  
 * @example  
 * initialize();
 */  
  private initialize() {
    this.isAuth = !!this.authService.user;
  }

    /**  
 * This is a logout function.  
 * @param {void} empty - A empty param  
 * @example  
 * onLogout();
 */ 
  onLogout() {
    sessionStorage.clear();
    this.authService.logOut();
  }

      /**  
 * This is a toggleSidenav function, it will open side nav.  
 * @param {void} empty - A empty param  
 * @example  
 * toggleSidenav();
 */ 
  toggleSidenav() {
    this.buttonClicked.emit('clicked');
  }

  addRadiologists() {
    this.addRadiologist.emit('clicked');
    console.log('Emitted')
  }

  /**  
   * This is a radiologistForm function, it will open Radiologist form.  
   * @param {void} empty - A empty param  
   * @example  
   * radiologistForm();
   */ 
  // radiologistForm() {
  //   this.buttonClicked.emit('click')
  // }

  /**  
 * This is a unsubscribe user subscription event.  
 * @param {void} empty - A empty param  
 * @example  
 * ngOnDestroy();
 */ 
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
