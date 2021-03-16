import {
  Component,
  HostListener,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  ViewChild, 
  TemplateRef
} from '@angular/core';
import { AuthService } from 'src/app/module/auth/auth.service';
import { Router } from '@angular/router';
import User from 'src/app/module/auth/user.modal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RadiologistRegisterComponent } from 'src/app/module/home/admin-dashboard/radiologist-register/radiologist-register.component';
import { EventEmitterService2 } from 'src/app/service/event-emitter.service2';
import { timer, Subscription} from 'rxjs';
import { IdleSessionTimeout } from 'idle-session-timeout';
@Component({
  selector: 'cxr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
// HeaderComponent class implementation
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  private refreshSubscription: Subscription;
  isAuth = false;
  doctorName: string;
  toggleActive: boolean;
  userroles: string;
  disabled: boolean;
  browerRefresh: boolean = false;
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();
  countDown: Subscription;
  counter: number;
  tick: number;
  session: any;
  @ViewChild('idleTimeoutModel') idleTimeoutModel: TemplateRef<any>;
  /*
   * constructor for HeaderComponent class
   */
  
  constructor(
    private authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    private eventEmitterService2: EventEmitterService2
  ) {
    this.authService.addRadiologist.next(false);
     // this.session = new IdleSessionTimeout(5 * 60 * 6000);
     this.session = new IdleSessionTimeout(5 * 60 * 3000);
     this.session.onTimeOut = () => {
       if (window.location.pathname !== '/auth/login') {
         this.couterFunction();
         const dialogConfig = new MatDialogConfig();
         dialogConfig.restoreFocus = false;
         dialogConfig.autoFocus = true;
         dialogConfig.role = 'dialog';
         this.dialog.open(this.idleTimeoutModel, {
           height: '220px',
           width: '520px',
           disableClose: true,
           position: { top: '63px' },
         });
       }
     };
     this.session.start();
  }

  /**
   * This is a class init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    this.session.start();
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.doctorName = user.username;
          this.userroles = user.userroles[0];
        }
      }
    );
    this.authService.addRadiologist.subscribe((status: boolean) => {
      if (status) {
        this.dialog.open(RadiologistRegisterComponent, {
          disableClose: true,
          width: '100%',
        });
      }
    });
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          const UserInfo = JSON.parse(JSON.stringify(user));
          sessionStorage.setItem('accessToken', UserInfo._token);
          const tokenNew = window.btoa(UserInfo._token);
          UserInfo._token = tokenNew;
          sessionStorage.setItem('userAuthData', JSON.stringify(UserInfo));
          this.refreshSubscription =  timer(840000, 840000).subscribe(() => {
            this.authService.refreshToken(sessionStorage.getItem('accessToken'),
            JSON.parse(sessionStorage.getItem('userAuthData')).refreshToken,
              UserInfo.username,
              UserInfo.userroles,
              UserInfo._tokenExpirationDate);
      });
        }
      }
    );
    this.toggleActive = false;
    this.initialize();
  }

  /**
   * This is a initialize function to check isAuth.
   * @param '{void}' empty - A empty param
   * @example
   * initialize();
   */

  private initialize() {
    this.isAuth = !!this.authService.user;
  }

  /**
   * This is a couterFunction function.
   * @param '{void}' empty - A empty param
   * @example
   * couterFunction();
   */

  couterFunction() {
    this.counter = 60;
    this.tick = 1000;
    this.countDown = timer(0, this.tick).subscribe(() => {
      if (this.counter === 0) {
        this.dialog.closeAll();
        this.onLogout();
        this.session.start();
      }
      --this.counter;
    });
  }

  /**
   * This is a stayInApp function.
   * @param '{void}' empty - A empty param
   * @example
   * stayInApp();
   */

  stayInApp() {
    this.dialog.closeAll();
    this.countDown.unsubscribe();
    this.session.dispose();
    this.session.start();
    const accessToken = JSON.parse(sessionStorage.getItem('userAuthData'));
    const token = sessionStorage.getItem('accessToken');
    this.authService.refreshToken(
      token,
      accessToken.refreshToken,
      accessToken.username,
      accessToken.userroles,
      accessToken._tokenExpirationDate
    );
  }

  /**
   * This is a logout function.
   * @param '{void}' empty - A empty param
   * @example
   * logout();
   */

  // logout() {
  //   this.dialog.closeAll();
  //   this.countDown.unsubscribe();
  //   this.session.dispose();
  //   this.session.start();
  //   const accessToken = JSON.parse(sessionStorage.getItem('userAuthData'));
  //   const token = sessionStorage.getItem('accessToken');
  //   this.authService.revokeToken(
  //     token,
  //     accessToken.refreshToken,
  //     accessToken.username,
  //     accessToken.userroles,
  //     accessToken._tokenExpirationDate
  //   );
  // }

  /**
   * This is a logout function.
   * @param '{void}' empty - A empty param
   * @example
   * onLogout();
   */

  onLogout() {
    if (this.refreshSubscription)
    this.refreshSubscription.unsubscribe();
    const accessToken = JSON.parse(sessionStorage.getItem('userAuthData'));
    const token = sessionStorage.getItem('accessToken');
    this.authService.revokeToken(
      token,
      accessToken.refreshToken,
      accessToken.username,
      accessToken.userroles,
      accessToken._tokenExpirationDate
    );
    this.authService.logOut();
  }

  /**
   * This is a toggleSidenav function, it will open side nav.
   * @param '{void}' empty - A empty param
   * @example
   * toggleSidenav();
   */

  toggleSidenav() {
    this.buttonClicked.emit('clicked');
  }
  addRadiologists() {
    this.authService.addRadiologist.next(true);
  }

  clearEvent(){
    this.eventEmitterService2.mlRejection(false, 'Manual');
    this.eventEmitterService2.nofindingsFromML(false, 'Manual');
  }

  /**
   * This is a unsubscribe user subscription event.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnDestroy();
   */

  ngOnDestroy() {
    this.authService.addRadiologist.next(false);
    if (this.refreshSubscription)
    this.refreshSubscription.unsubscribe();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
