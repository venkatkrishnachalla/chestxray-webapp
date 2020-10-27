import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { SettingsComponent } from './settings/settings.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImplicitReceiver } from '@angular/compiler';
import { PatientListComponent } from './patient-list/patient-list.component';
import { LocalFilesystemComponent } from './local-filesystem/local-filesystem.component';
import { DragDropComponent } from './local-filesystem/drag-drop/drag-drop.component';
import { CoreModule } from 'src/app/core/core.module';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RadiologistRegisterComponent } from './admin-dashboard/radiologist-register/radiologist-register.component';
import { HospitalRadiologistComponent } from './admin-dashboard/hospital-radiologist/hospital-radiologist.component';
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { PaginationComponent} from '../shared/UI/pagination/pagination.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    CalendarComponent,
    ChatRoomComponent,
    MyAccountComponent,
    SettingsComponent,
    PatientListComponent,
    LocalFilesystemComponent,
    DragDropComponent,
    PatientInfoComponent,
    AdminDashboardComponent,
    RadiologistRegisterComponent,
    HospitalRadiologistComponent,
    PaginationComponent
  ],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    SharedModule,
    AgGridModule.withComponents([]),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule
  ],
})
// HomeModule class implementation
export class HomeModule {}
