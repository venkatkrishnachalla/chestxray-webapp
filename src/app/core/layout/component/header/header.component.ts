import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/module/auth/auth.service';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/core/service/sidenav.service';

@Component({
  selector: 'cxr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuth = false;
  doctorName = 'Dr.Adam';
  toggleActive: boolean = false;

  constructor(
    private authService: AuthService,
    public router: Router,
    private sidenav: SidenavService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  private initialize() {
    this.isAuth = !!this.authService.user;
  }

  onLogout() {
    this.authService.logOut();
  }

  toggleSidenav() {
    this.toggleActive = !this.toggleActive;
    this.sidenav.toggle();
  }
}
