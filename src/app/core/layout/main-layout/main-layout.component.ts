import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { sideNavConstants } from '../../../constants/sidenavConstants';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cxr-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  currentApplicationVersion = environment.appVersion;
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

  /*** class init function ***/
  ngOnInit() {
    this.sidenavButton = this.constants.sidenavContent;
    this.socialMediaImage = this.constants.socialMedia;
  }

  /*** it will close sidenav ***/
  close() {
    this.sidenav.close();
  }

  /*** it will open sidenav ***/
  toggleSidenavBar(valueEmitted) {
    this.sidenav.toggle();
  }
}
