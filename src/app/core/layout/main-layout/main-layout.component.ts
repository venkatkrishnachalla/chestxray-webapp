import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { sideNavConstants } from '../../../constants/sidenavConstants';
import { environment } from '../../../../environments/environment';
import { staticContentHTML } from 'src/app/constants/staticContentHTML';

@Component({
  selector: 'cxr-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
// MainLayoutComponent class implementation
export class MainLayoutComponent implements OnInit {
  currentApplicationVersion = environment.appVersion;
  sideNavToggle: boolean;
  readonly constants = sideNavConstants;
  readonly staticContents = staticContentHTML;

  @ViewChild('sidenavbar') sidenav: MatSidenav;

  sidenavButton: {
    icons: string;
    label: string;
    routerLink: string;
  }[];
  sidenavLabels: {
    name: string;
    title: string;
  }[];
  socialMediaImages: {
    image: string;
    alt: string;
    title: string;
  }[];
  copyRightText: {
    copyRightDisplayText: string;
  };
  bottomContent: string[];
  /*
   * constructor for MainLayoutComponent class
   */

  constructor() {}

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit() {
    this.sidenavButton = this.constants.sidenavContent;
    this.sidenavLabels = this.staticContents.dashboardPage;
    this.socialMediaImages = this.staticContents.socialMedia;
    this.copyRightText = this.staticContents.copyRight;
  }

  /**
   * This is a close function, it will close sidenav.
   * @param '{void}' empty - A empty param
   * @example
   * close();
   */

  close() {
    this.sidenav.close();
  }

  /**
   * This is a open function, it will open sidenav.
   * @param '{string}' value - A string param
   * @example
   * toggleSidenavBar(valueEmitted);
   */

  toggleSidenavBar(valueEmitted) {
    this.sidenav.toggle();
  }
}
