import { Component, OnInit } from '@angular/core';
import { staticContentHTML } from 'src/app/constants/staticContentHTML';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'cxr-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  currentApplicationVersion = environment.appVersion;
  readonly constants = staticContentHTML;
  copyRightText: { copyRightDisplayText: string };
  socialMediaIcons: { image: string; alt: string; title: string }[];

  // Slider Images
  slides = [
    {
      image: '../../../../assets/images/select icon active@2x.png',
      title: 'Title Name',
      content:
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    },
    {
      image: 'https://gsr.dev/material2-carousel/assets/demo.png',
      title: 'Title Name',
      content:
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    },
    {
      image: 'https://gsr.dev/material2-carousel/assets/demo.png',
      title: 'Title Name',
      content:
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    },
    {
      image: 'https://gsr.dev/material2-carousel/assets/demo.png',
      title: 'Title Name',
      content:
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    },
  ];

  // // Slider content
  // slideContent = [
  //   {content: 'Hello Pramod'},
  //   {content: 'Hello Pramod'},
  //   {content: 'Hello Pramod'},
  //   {content: 'Hello Pramod'},
  // ];

  constructor() {}

  ngOnInit(): void {
    this.copyRightText = this.constants.copyRight;
    this.socialMediaIcons = this.constants.socialMedia;
  }
}
