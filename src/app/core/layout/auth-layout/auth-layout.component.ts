import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/module/auth/auth.service';

@Component({
  selector: 'cxr-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent implements OnInit {
  isAuth = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.initialize();
  }

  private initialize() {
    this.isAuth = !!this.authService.user;
  }

  onLogout() {
    this.authService.logOut();
  }
}
