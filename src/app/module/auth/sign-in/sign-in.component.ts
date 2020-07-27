import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SnackbarService } from 'src/app/core/service/snackbar.service';
import { AuthService } from '../auth.service';
import { ConsoleService } from 'src/app/core/service/console.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../shared/UI/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
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

  ngOnInit(): void {}

  onSignIn(form: NgForm) {
    const networkStatus = navigator.onLine;
    if (form.valid) {
      this.spinnerService.show();
      this.authService.signIn(this.auth.email, this.auth.password).subscribe(
        (authResponse: any) => {
          this.spinnerService.hide();
          this.console.log(authResponse);
          localStorage.setItem('loggedInUser', this.auth.email);
          this.router.navigate(['/home/dashboard']);
        },
        (errorMessage: any) => {
          this.spinnerService.hide();
          this.errorMessage = errorMessage;
          if (networkStatus === false) {
            this.toastrService.error(
              'Please check your network connections and try again.'
            );
            this.toastrService.clear();
          } else {
            this.toastrService.error(
              'Invalid Username or Password'
            );
            this.toastrService.clear();
          }
          form.reset();
        }
      );
    } else {
      this.spinnerService.hide();
      this.toastrService.error(
        'Enter all the required fields'
      );    
      this.toastrService.clear();
    }

  }
}
