import { Component, OnInit } from '@angular/core';
import { AuthService } from './module/auth/auth.service';

@Component({
  selector: 'cxr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'cxr-web-app';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginOnBrowserRefresh();
  }

  loginOnBrowserRefresh() {
    this.authService.autoLoginOnRefresh();
  }
}
