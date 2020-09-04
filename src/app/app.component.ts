import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from './module/auth/auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { SpinnerService } from './module/shared/UI/spinner/spinner.service';
import { IdleSessionTimeout } from 'idle-session-timeout';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { timer, Subscription } from 'rxjs';
@Component({
  selector: 'cxr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
// AppComponent class implementation 
export class AppComponent implements OnInit {
  title = 'cxr-web-app';
  isLoading = false;
  countDown: Subscription;
  counter: number;
  tick: number;
  session: any;
  @ViewChild('idleTimeoutModel') idleTimeoutModel: TemplateRef<any>;

  /*  
* constructor for AppComponent class  
*/ 
  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.session = new IdleSessionTimeout(5 * 60 * 50);
    this.session.onTimeOut = () => {
      if (window.location.pathname !== '/auth/login'){
        this.couterFunction();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.restoreFocus = false;
        dialogConfig.autoFocus = true;
        dialogConfig.role = 'dialog';
        this.dialog.open(this.idleTimeoutModel, {
          height: '220px',
          width: '520px',
          disableClose: true,
          position: {top: '63px'}
        });
      }
    };
    this.session.start();
  }

  /**  
* This is a init function.  
* @param {void} empty - A empty param  
* @example  
* ngOnInit();
*/ 
  ngOnInit(): void {
    this.session.start();
    this.loginOnBrowserRefresh();
    this.spinnerService.getLoaderData().subscribe((response: boolean) => {
      this.isLoading = response;
    });
  }

  /**  
* This is a loginOnBrowserRefresh function.  
* @param {void} empty - A empty param  
* @example  
* loginOnBrowserRefresh();
*/ 
  loginOnBrowserRefresh() {
    this.authService.autoLoginOnRefresh();
  }

  couterFunction(){
    this.counter = 30;
    this.tick = 1000;
    this.countDown = timer(0, this.tick).subscribe(() => {
      if (this.counter === 0){
        this.dialog.closeAll();
        this.router.navigate(['login']);
        this.session.start();
      }
      --this.counter;
    });
  }

  stayInApp(){
    this.dialog.closeAll();
    this.countDown.unsubscribe();
    this.session.dispose();
    this.session.start();
  }
  logout(){
    this.dialog.closeAll();
    this.countDown.unsubscribe();
    this.session.dispose();
    this.session.start();
    this.router.navigate(['login']);
  }
}
