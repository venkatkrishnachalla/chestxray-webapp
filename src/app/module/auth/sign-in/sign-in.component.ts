import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SnackbarService } from 'src/app/core/service/snackbar.service';
import { AuthService } from '../auth.service';
import { ConsoleService } from 'src/app/core/service/console.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../shared/UI/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { SignInResponse } from '../interface.modal';

@Component({
  selector: 'cxr-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  auth: { email: string; password: string } = { email: '', password: '' };
  hide = true;
  errorMessage = '';
  breakpoint: number;
  constructor(
    private alert: SnackbarService,
    private authService: AuthService,
    private console: ConsoleService,
    private router: Router,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService
  ) {}

  /*** class init function ***/
  ngOnInit(): void {}

  /*** on sign in function ***/
  onSignIn(form: NgForm) {
    const networkStatus = navigator.onLine;
    if (form.valid) {
      this.spinnerService.show();
      this.authService.signIn(this.auth.email, this.auth.password).subscribe(
        (authResponse: SignInResponse) => {
          this.spinnerService.hide();
          localStorage.setItem('loggedInUser', this.auth.email);
          this.router.navigate(['/home/dashboard']);
        },
        (errorMessage: string) => {
          this.spinnerService.hide();
          this.errorMessage = errorMessage;
          if (networkStatus === false) {
            this.toastrService.error(
              'Please check your network connections and try again.'
            );
          } else {
            this.toastrService.error('Invalid Username or Password');
          }
          form.reset();
        }
      );
    } else {
      this.spinnerService.hide();
      this.toastrService.error('Enter all the required fields');
    }
  }
}
