import { Component } from '@angular/core';
import { AuthService } from './module/auth/auth.service';

@Component({
  selector: 'cxr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cxr-web-app';
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.loginOnBrowserRefresh();
  }

  loginOnBrowserRefresh() {
    this.authService.autoLoginOnRefresh();
  }
}
