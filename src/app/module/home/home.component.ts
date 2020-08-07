import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'cxr-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService) {}

  /*** class init function ***/
  ngOnInit(): void {}

  /*** log out function ***/
  logOut() {
    this.authService.logOut();
  }
}
