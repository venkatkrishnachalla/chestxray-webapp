import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { sideNavConstants } from '../../../../constants/sidenavConstants';

@Component({
  selector: 'cxr-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
// SideNavComponent class implementation
export class SideNavComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  @Input() sideNavToggle: boolean;
  readonly constants = sideNavConstants;

  sidenavButton: { icons: string; label: string; routerLink: string }[];
  /*
   * constructor for SideNavComponent class
   */

  constructor() {}

  /**
   * This is a host listener when resizing window function.
   * @param {string} value - A string param
   * @param {any} data - A array param
   * @example
   * HostListener('window:resize', []);
   */

  @HostListener('window:resize', [])
  public onResize() {
    this.sidenavDisplay();
  }

  /**
   * This is a init function.
   * @param {void} empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit() {
    this.sidenavButton = this.constants.sidenavContent;
    this.sidenavDisplay();
  }

  /**
   * This is a sidenavDisplay function.
   * @param {void} empty - A empty param
   * @example
   * sidenavDisplay();
   */

  sidenavDisplay() {
    if (window.innerWidth <= 768) {
      this.sideNavToggle = true;
    } else {
      this.sideNavToggle = false;
    }
  }
}
