import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/module/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cxr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuth = false;
  doctorName = 'Dr.Adam';
  patientID = '1004';

  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor(private authService: AuthService, public router: Router) {}

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
    this.buttonClicked.emit('clicked');
  }
}
