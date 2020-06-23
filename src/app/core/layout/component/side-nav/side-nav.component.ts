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
export class SideNavComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  @Input() sideNavToggle: boolean;
  readonly constants = sideNavConstants;
  sidenavButton: { icons: string; label: string; routerLink: string }[];

  constructor() {}

  @HostListener('window:resize', [])
  public onResize() {
    this.sidenavDisplay();
  }

  ngOnInit() {
    this.sidenavButton = this.constants.sidenavContent;
    this.sidenavDisplay();
  }

  sidenavDisplay() {
    if (window.innerWidth <= 768) {
      this.sideNavToggle = true;
    } else {
      this.sideNavToggle = false;
    }
  }
}
