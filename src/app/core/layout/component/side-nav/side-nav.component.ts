import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'cxr-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  sideNavToggle: boolean;

  mode = new FormControl('over');

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  constructor() {}

  
  @HostListener("window:resize", [])
    public onResize() {
      this.sidenavDisplay();
  }

  ngOnInit() {
    this.sidenavDisplay();
  }

  sidenavDisplay(){
    if(window.innerWidth <= 768){
      this.sideNavToggle = true;
    }
    else{
      this.sideNavToggle = false;
    }
  }
}
