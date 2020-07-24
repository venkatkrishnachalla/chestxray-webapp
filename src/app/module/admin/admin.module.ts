import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HospitalRegistrationComponent } from './hospital-registration/hospital-registration.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    HospitalRegistrationComponent,
  ],
  imports: [CommonModule],
})
export class AdminModule {}
