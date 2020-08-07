import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/module/auth/auth.service';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Component({
  selector: 'cxr-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent implements OnInit {
  isAuth = false;
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  constructor(private authService: AuthService, private breakpointObserver: BreakpointObserver) {}

  /*** init function ***/
  ngOnInit(): void {
    this.initialize();
  }

  /*** initialize function to display isAuth ***/
  private initialize() {
    this.isAuth = !!this.authService.user;
  }

  /*** logout function ***/
  onLogout() {
    this.authService.logOut();
  }
}
