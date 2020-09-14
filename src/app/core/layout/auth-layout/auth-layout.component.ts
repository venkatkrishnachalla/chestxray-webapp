import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/module/auth/auth.service';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'cxr-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
// AuthLayoutComponent class implementation  
export class AuthLayoutComponent implements OnInit {
  isAuth = false;
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
      /*  
    * Constrcutor for AuthLayoutComponent class  
    */  
  constructor(private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {}

   /**  
 * This is a init function.  
 * @param {void}  - A empty param  
 * @example  
 * ngOnInit();
 */  
  ngOnInit(): void {
    this.initialize();
  }

     /**  
 * This is a initialize function.  
 * @param {void}  - A empty param  
 * @example  
 * initialize();
 */  
  private initialize() {
    this.isAuth = !!this.authService.user;
  }

     /**  
 * This is a logout function.  
 * @param {void}  - A empty param  
 * @example  
 * onLogout();
 */    
  onLogout() {
    this.authService.logOut();
  }
}
