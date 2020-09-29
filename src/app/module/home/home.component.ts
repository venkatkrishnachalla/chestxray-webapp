import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'cxr-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
// HomeComponent class implementation
export class HomeComponent implements OnInit {
  /*
   * constructor for HomeComponent class
   */

  constructor(private authService: AuthService) {}

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {}

  /**
   * This is a logOut.
   * @param '{void}' empty - A empty param
   * @example
   * logOut();
   */

  logOut() {
    this.authService.logOut();
  }
}
