import { Component, OnInit } from '@angular/core';
import { staticContentHTML } from 'src/app/constants/staticContentHTML';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'cxr-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  currentApplicationVersion = environment.appVersion;
  readonly constants = staticContentHTML;
  copyRightText: { copyRightDisplayText: string };
  socialMediaIcons: { image: string; alt: string; title: string }[];
  constructor() { }

  ngOnInit(): void {
    this.copyRightText = this.constants.copyRight;
    this.socialMediaIcons = this.constants.socialMedia;
  }

}
