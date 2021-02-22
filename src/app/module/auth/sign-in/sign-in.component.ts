import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
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
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'cxr-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
// SignInComponent class implementation
export class SignInComponent implements OnInit {
  auth: { email: string; password: string } = { email: '', password: '' };
  hide = true;
  errorMessage = '';
  errorStatus: any;
  breakpoint: number;
  readonly constants = staticContentHTML;
  signInText: { loginTitle: string; forgotPasswordText: string };
  copyRightText: { copyRightDisplayText: string };
  socialMediaIcons: { image: string; alt: string; title: string }[];
  @ViewChild('usernameRef', { static: true }) usernameElementRef: ElementRef;

  /*
   * constructor for SignInComponent class
   */

  constructor(
    private alert: SnackbarService,
    private authService: AuthService,
    private console: ConsoleService,
    private router: Router,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    private eventEmitterService: EventEmitterService
  ) {
    if (sessionStorage.getItem('userAuthData')) {
      this.router.navigate(['home/dashboard']);
    }
  }

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */
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

  /**
   * This is on sign in function.
   * @param '{NgForm}' data - A array param
   * @example
   * onSignIn(form);
   */
  onSignIn(form: NgForm) {
    const networkStatus = navigator.onLine;
    if (form.valid && form.value.username && form.value.password) {
      this.spinnerService.show();
      this.authService.signIn(this.auth.email, this.auth.password).subscribe(
        (authResponse: SignInResponse) => {
          sessionStorage.setItem('unableToDiagnose', JSON.stringify(false));
          sessionStorage.setItem('noFindings', JSON.stringify(false));
          this.spinnerService.hide();
          this.router.navigate(['/home/dashboard']);
        },
        (errorMessage) => {
          this.spinnerService.hide();
          if (networkStatus === false) {
            this.toastrService.error(
              'Please check your network connections and try again.'
            );
          } 
          else if(!errorMessage.error){
            this.toastrService.error(errorMessage);
          }
          else{
            this.toastrService.error(errorMessage.error);
          }
          // else if (this.errorMessage === 'Server not reachable') {
          //   this.toastrService.error('Server not reachable');
          // } else if (this.errorMessage === 'Unknown error occurred') {
          //   this.toastrService.error('Please, Log out from other instance!');
          // } else {
          //   this.toastrService.error('Invalid Username or Password');
          // }
          form.reset();
        }
      );
    } else {
      this.spinnerService.hide();
      if (networkStatus === false) {
        this.toastrService.error(
          'Please check your network connections and try again.'
        );
      } else if (form.value.username && form.value.password) {
        this.toastrService.error('Enter valid username or password');
      } else {
        this.toastrService.error('Enter all the required fields');
      }
    }
  }
}
