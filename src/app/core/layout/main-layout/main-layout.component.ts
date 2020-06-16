import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { sideNavConstants } from '../../../constants/sidenavConstants';
import { SideNavComponent } from '../component/side-nav/side-nav.component';

@Component({
  selector: 'cxr-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  sideNavToggle: boolean;
  readonly constants = sideNavConstants;

  @ViewChild('sidenavbar') sidenav: MatSidenav;

  sidenavButton: {
    icons: string;
    label: string;
    routerLink: string;
  }[];
  socialMediaImage: {
    image: string;
    alt: string;
  }[];
  bottomContent: string[];

  constructor() {}

  ngOnInit() {
    this.sidenavButton = this.constants.sidenavContent;
    this.socialMediaImage = this.constants.socialMedia;
  }

  close() {
    this.sidenav.close();
  }

  toggleSidenavBar(valueEmitted) {
    this.sidenav.toggle();
  }
}
