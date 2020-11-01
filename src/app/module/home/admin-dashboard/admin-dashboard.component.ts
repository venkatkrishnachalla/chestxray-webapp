import { Component, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import User from '../../auth/user.modal';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { RadiologistRegisterComponent } from './radiologist-register/radiologist-register.component';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from 'src/app/service/dashboard.service';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { SpinnerService } from '../../shared/UI/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cxr-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})

export class AdminDashboardComponent implements OnInit {
  private userSubscription: Subscription;
  patientList: any = [];
  displayedColumns: string[] = ['hospitalPatientId', 'name','radiologist', 'birthDate', 'sex', 'age'];
  dataSource;
  showError: boolean;
  showloader: boolean;
  showTable: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(RadiologistRegisterComponent) radiologist: RadiologistRegisterComponent;
  xray: any[];

  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private eventEmitterService: EventEmitterService,
    ) {
      this.authService.addRadiologist.next(false);
    }

  ngOnInit(): void {
    this.spinnerService.show();

  
    // To open addRadiologist pop up modal
    this.authService.addRadiologist.subscribe((status: boolean) => {
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
    this.getPatientList();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPatientList() {
    this.showloader = true;
    this.showTable = false;
    this.dashboardService.getPatientList().subscribe( data => {
     
      // tslint:disable-next-line: no-string-literal
      this.patientList = data['data'];
      this.dataSource = new MatTableDataSource(this.patientList);
      this.spinnerService.hide();

      this.showloader = false;
      this.showTable = true;
      this.showError = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    (errorMessage: string) => {
      this.showloader = false;
      this.showTable = false;
      this.eventEmitterService.onErrorMessage({
        data: errorMessage,
      });
    }
    );
  }
}
