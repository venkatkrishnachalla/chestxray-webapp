import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { sideNavConstants } from '../../../constants/sidenavConstants';
import { environment } from '../../../../environments/environment';
import { staticContentHTML } from 'src/app/constants/staticContentHTML';
import { AuthService } from 'src/app/module/auth/auth.service';
import User from 'src/app/module/auth/user.modal';
import { EventEmitterService2 } from 'src/app/service/event-emitter.service2';
import { EventEmitter } from 'protractor';

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
  mlVerion: any;

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
  isAdmin: boolean;
  /*
   * constructor for MainLayoutComponent class
   */

  constructor(private authService:AuthService, 
              private eventEmitterService: EventEmitterService2) {}

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
    const MLVerion = sessionStorage.getItem('MLversion');
    if (MLVerion){
      this.mlVerion = sessionStorage.getItem('MLversion');
    }
    this.authService.userSubject.subscribe(
      (user: User) => {​​​​​​​​
      if (user) {​​​​​​​​
      this.isAdmin = user.userroles[0] === 'Admin' ? true : false;
      }​​​​​​​​
      }​​​​​​​​
    );
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
