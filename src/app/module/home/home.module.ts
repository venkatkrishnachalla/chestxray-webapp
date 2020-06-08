import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule} from '@angular/forms';

@NgModule({
  declarations: [HomeComponent,
                 DashboardComponent],
  imports: [MaterialModule,
            FormsModule,
            CommonModule,
            AgGridModule.withComponents([])
          ],
})
export class HomeModule {}
