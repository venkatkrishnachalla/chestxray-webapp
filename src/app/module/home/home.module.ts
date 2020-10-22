import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { SharedModule } from '../shared/shared.module';
import { HospitalRadiologistComponent } from './hospital-radiologist/hospital-radiologist.component';
import { NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown'
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { NgxSpinnerModule } from "ngx-spinner";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
  ],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgxSpinnerModule,
    AgGridModule.withComponents([]),
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
// HomeModule class implementation
export class HomeModule {}
