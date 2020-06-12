import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'cxr-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  sideNavToggle: boolean;
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some((h) =>
    h.test(window.location.host)
  );

  @ViewChild('sidenavbar') sidenav: MatSidenav;

  @HostListener('window:resize', [])
  public onResize() {
    this.sidenavDisplay();
  }
  constructor() {}

  ngOnInit() {
    this.sidenavDisplay();
  }

  close() {
    this.sidenav.close();
  }

  sidenavDisplay() {
    if (window.innerWidth <= 768) {
      this.sideNavToggle = true;
    } else {
      this.sideNavToggle = false;
    }
  }
  
  toggleSidenavBar(valueEmitted){
    console.log(valueEmitted);
    this.sidenav.toggle();
  }
}
