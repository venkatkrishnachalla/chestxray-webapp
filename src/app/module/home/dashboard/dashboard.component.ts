import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import User from '../../auth/user.modal';
@Component({
  selector: 'cxr-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  isHospitalRadiologist: boolean;

  constructor(private authService: AuthService) {}

  /*** class init function, retrieve current user details ***/
  ngOnInit(): void {
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.isHospitalRadiologist =
            user.userroles[0] === 'HospitalRadiologist' ? true : false;
        }
      }
    );
  }

  /*** unsubscribe userSubscription event ***/
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
