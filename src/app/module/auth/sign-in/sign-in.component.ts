import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SnackbarService } from 'src/app/core/service/snackbar.service';
import { AuthService } from '../auth.service';
import { ConsoleService } from 'src/app/core/service/console.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../shared/UI/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { SignInResponse } from '../interface.modal';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { staticContentHTML } from 'src/app/constants/staticContentHTML';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'cxr-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  // Declared all the local and global variables
  auth: { email: string; password: string } = { email: '', password: '' };
  hide = true;
  errorMessage = '';
  errorStatus: any;
  breakpoint: number;
  readonly constants = staticContentHTML;
  signInText: { loginTitle: string; forgotPasswordText: string };
  copyRightText: { copyRightDisplayText: string };
  socialMediaIcons: { image: string; alt: string; title: string }[];
  @ViewChild('usernameRef', {static: true}) usernameElementRef: ElementRef;

  // Injecting dependencies to fetch the services of HTTP methods
  constructor(
    private alert: SnackbarService,
    private authService: AuthService,
    private console: ConsoleService,
    private router: Router,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    private eventEmitterService: EventEmitterService
  ) {
    if(sessionStorage.getItem('userAuthData')) {
      this.router.navigate(['home/dashboard']);
    }
  }

  /*** class init function ***/
  ngOnInit(): void {
    this.usernameElementRef.nativeElement.focus();
    this.signInText = this.constants.loginPage;
    this.copyRightText = this.constants.copyRight;
    this.socialMediaIcons = this.constants.socialMedia;
    this.eventEmitterService.invokeDisplayErrorMessage.subscribe(
      (statusCode) => {
        this.errorStatus = statusCode;
      }
    );
  }

  /*** on sign in function to login to the application and also 
  handling error based on server response ***/
  onSignIn(form: NgForm) {
    const networkStatus = navigator.onLine;
    if (form.valid) {
      this.spinnerService.show();
      this.authService.signIn(this.auth.email, this.auth.password).subscribe(
        (authResponse: SignInResponse) => {
          this.spinnerService.hide();
          this.router.navigate(['/home/dashboard']);
        },
        (errorMessage: string) => {
          this.spinnerService.hide();
          this.errorMessage = errorMessage;
          if (networkStatus === false) {
            this.toastrService.error(
              'Please check your network connections and try again.'
            );
          } else if (this.errorMessage === 'Server not reachable') {
            this.toastrService.error('Server not reachable');
          } else {
            this.toastrService.error('Invalid Username or Password');
          }
          form.reset();
        }
      );
    } else {
      this.spinnerService.hide();
      if (networkStatus === false) {
        this.toastrService.error(
          'Please check your network connections and try again.'
        );
      } else {
        this.toastrService.error('Enter all the required fields');
      }
    }
  }

}
