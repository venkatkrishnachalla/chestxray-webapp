import { Component, OnInit } from '@angular/core';
import { AuthService } from './module/auth/auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { SpinnerService } from './module/shared/UI/spinner/spinner.service';
@Component({
  selector: 'cxr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'cxr-web-app';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.loginOnBrowserRefresh();
    this.spinnerService.getLoaderData().subscribe((response: boolean) => {
      this.isLoading = response;
    });
  }

  loginOnBrowserRefresh() {
    this.authService.autoLoginOnRefresh();
  }
}
