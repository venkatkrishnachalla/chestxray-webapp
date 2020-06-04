import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SnackbarService } from 'src/app/core/service/snackbar.service';
import { AuthService } from '../auth.service';
import { ConsoleService } from 'src/app/core/service/console.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cxr-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  isLoading = false;
  auth: { email: string; password: string } = { email: '', password: '' };
  errorMessage = '';
  constructor(
    private alert: SnackbarService,
    private authService: AuthService,
    private console: ConsoleService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSignIn(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.authService.signIn(this.auth.email, this.auth.password).subscribe(
        (authResponse) => {
          this.isLoading = false;
          this.console.log(authResponse);
          this.router.navigate(['/home']);
        },
        (errorMessage) => {
          this.isLoading = false;
          this.errorMessage = errorMessage;
          this.alert.open(this.errorMessage, 'ERROR');
          form.reset();
        }
      );
    } else {
      this.errorMessage = 'Enter all the required fields';
      this.alert.open(this.errorMessage, 'ERROR');
    }
  }
}
