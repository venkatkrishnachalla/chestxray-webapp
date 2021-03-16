import { Component, OnInit } from '@angular/core';
import { AuthService } from './module/auth/auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { SpinnerService } from './module/shared/UI/spinner/spinner.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'cxr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
// AppComponent class implementation
export class AppComponent implements OnInit {
  title = 'cxr-web-app';
  isLoading = false;
  

  /*
   * constructor for AppComponent class
   */

  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private router: Router
  ) {
   
  }

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    this.loginOnBrowserRefresh();
    this.spinnerService.getLoaderData().subscribe((response: boolean) => {
      this.isLoading = response;
    });
  }

  /**
   * This is a loginOnBrowserRefresh function.
   * @param '{void}' empty - A empty param
   * @example
   * loginOnBrowserRefresh();
   */

  loginOnBrowserRefresh() {
    this.authService.autoLoginOnRefresh();
  }

//   doBeforeUnload() {
//       return false;
//   }

// doUnload() {
//     const accessToken = JSON.parse(sessionStorage.getItem('userAuthData'));
//     const token = sessionStorage.getItem('accessToken');
//     this.authService.revokeToken(
//       token,
//       accessToken.refreshToken,
//       accessToken.username,
//       accessToken.userroles,
//       accessToken._tokenExpirationDate
//     );
//     this.authService.logOut();
//     for(let i = 0; i < 10000000; i++){
//       console.log(i);
//     }
//   }
}
