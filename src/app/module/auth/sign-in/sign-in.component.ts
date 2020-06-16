import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SnackbarService } from 'src/app/core/service/snackbar.service';
import { AuthService } from '../auth.service';
import { ConsoleService } from 'src/app/core/service/console.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../shared/UI/spinner/spinner.service';
@Component({
  selector: 'cxr-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  auth: { email: string; password: string } = { email: '', password: '' };
  errorMessage = '';
  breakpoint: number;
  constructor(
    private alert: SnackbarService,
    private authService: AuthService,
    private console: ConsoleService,
    private router: Router,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    // this.breakpoint = (window.innerWidth <= 400) ? 1 : 1;
    this.breakpoint = window.innerWidth <= 1200 ? 1 : 2;
    this.breakpoint = window.innerWidth <= 850 ? 1 : 2;
  }

  onResize(event) {
    // this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 1;
    this.breakpoint = event.target.innerWidth <= 1200 ? 1 : 2;
    this.console.log(event.target.innerWidth);
    this.breakpoint = event.target.innerWidth <= 850 ? 1 : 2;
  }

  onSignIn(form: NgForm) {
    const networkStatus = navigator.onLine;
    if (form.valid) {
      this.spinnerService.show();
      this.authService.signIn(this.auth.email, this.auth.password).subscribe(
        (authResponse: any) => {
          this.spinnerService.hide();
          this.console.log(authResponse);
          this.router.navigate(['/home/dashboard']);
        },
        (errorMessage: any) => {
          this.spinnerService.hide();
          this.errorMessage = errorMessage;
          if (networkStatus === false) {
            this.errorMessage =
              'You are not connected to a network. Check your network connections and try again.';
          } else {
            this.errorMessage = 'Invalid Username or Password';
          }
          this.alert.open(this.errorMessage, 'ERROR');
          form.reset();
        }
      );
    } else {
      this.spinnerService.hide();
      this.errorMessage = 'Enter all the required fields';
      this.alert.open(this.errorMessage, 'ERROR');
    }
  }
}
