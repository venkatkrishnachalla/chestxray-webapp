import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/module/auth/auth.service';

@Component({
  selector: 'cxr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuth = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.initialize();
  }

  private initialize() {
    this.isAuth = !!this.authService.user;
  }

  onLogout() {
    this.authService.logOut();
  }
}
