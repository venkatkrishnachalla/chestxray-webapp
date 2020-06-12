import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SnackbarService } from 'src/app/core/service/snackbar.service';
import { AuthService } from '../auth.service';
import { ConsoleService } from 'src/app/core/service/console.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cxr-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  auth: { username: string; email: string; password: string } = {
    username: '',
    email: '',
    password: '',
  };
  errorMessage = '';
  constructor(
    private alert: SnackbarService,
    private authService: AuthService,
    private console: ConsoleService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  onSignUp(form: NgForm) {
    if (form.valid) {
      this.console.log(this.auth.email, this.auth.password);
      this.authService.singUp(this.auth.email, this.auth.password).subscribe(
        (authResult) => {
          this.console.log(authResult);
          this.router.navigate(['/auth/login']);
        },
        (errorMessage) => {
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
