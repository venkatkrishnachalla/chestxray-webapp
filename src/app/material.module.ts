import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';


const materialModules = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatDividerModule,
  MatButtonModule,
  MatSnackBarModule,
  MatMenuModule,
  MatIconModule,
  MatGridListModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatListModule
];

@NgModule({
  imports: [...materialModules],
  exports: [...materialModules],
  providers: [],
  bootstrap: [],
})
export class MaterialModule {}
