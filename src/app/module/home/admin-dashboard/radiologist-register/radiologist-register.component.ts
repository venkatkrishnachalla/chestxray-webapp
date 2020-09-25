import { Component, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

/**
 * @title Dialog elements
 */
@Component({
  selector: 'cxr-radiologist-register',
  templateUrl: './radiologist-register.component.html',
  styleUrls: ['./radiologist-register.component.scss']
})

export class RadiologistRegisterComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(RadiologistRegisterComponent);
  }

  toggleRadiologist(event) {
    console.log('evnets', event);
  }

}
