import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
  MatSidenavModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatCheckboxModule,
  MatListModule,
  MatDialogModule,
  MatAutocompleteModule,
];

@NgModule({
  imports: [...materialModules],
  exports: [...materialModules],
  providers: [],
  bootstrap: [],
})
export class MaterialModule {}
