import { Component, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import User from '../../auth/user.modal';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { RadiologistRegisterComponent } from './radiologist-register/radiologist-register.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientListData } from '../../auth/interface.modal';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'cxr-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})

export class AdminDashboardComponent implements OnInit {
  private userSubscription: Subscription;
  patientList: any = [];
  displayedColumns: string[] = ['hospitalPatientId', 'name', 'birthDate', 'sex', 'age'];
  dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(RadiologistRegisterComponent) radiologist: RadiologistRegisterComponent;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private dashboardService: DashboardService
    ) {}

  ngOnInit(): void {
    console.log(this.getPatientList());
    // To open addRadiologist pop up modal
    this.authService.addRadiologist.subscribe((status: Boolean) => {
      if (status){
      this.dialog.open(RadiologistRegisterComponent, { disableClose: true, width: '100%' });
      }
    });

    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          const UserInfo = JSON.parse(JSON.stringify(user));
          sessionStorage.setItem('accessToken', UserInfo._token);
          const tokenNew = window.btoa(UserInfo._token);
          UserInfo._token = tokenNew;
          sessionStorage.setItem('userAuthData', JSON.stringify(UserInfo));
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPatientList() {
    this.dashboardService.getPatientList().subscribe( data => {
      // tslint:disable-next-line: no-string-literal
      this.patientList = data['data'];
      this.dataSource = new MatTableDataSource(this.patientList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
