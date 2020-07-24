import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/module/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import User from 'src/app/module/auth/user.modal';

@Component({
  selector: 'cxr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  isAuth = false;
  doctorName: string;
  toggleActive: boolean;

  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    public router: Router,
    ) {}

  /*** class init function ***/
  ngOnInit(): void {
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.doctorName = user.username;
        }
      }
    );
    this.toggleActive = false;
    this.initialize();
  }

  /*** initialize function to check isAuth ***/
  private initialize() {
    this.isAuth = !!this.authService.user;
  }

  /*** on logout function ***/
  onLogout() {
    this.authService.logOut();
  }

  /*** toggleSidenav function, it will open side nav ***/
  toggleSidenav() {
    this.buttonClicked.emit('clicked');
  }

  /*** unsubscribe user subscription event ***/
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
