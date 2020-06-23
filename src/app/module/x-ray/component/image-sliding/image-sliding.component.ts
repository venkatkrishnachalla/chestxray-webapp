import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-image-sliding',
  templateUrl: './image-sliding.component.html',
  styleUrls: ['./image-sliding.component.scss'],
})
export class ImageSlidingComponent implements OnInit {
  slides = [
    {
      img: '../../../assets/images/download (1).jpg',
    },
    {
      img: './../../assets/images/download (2).jpg',
    },
    {
      img: './../../assets/images/download.jpg',
    },
    {
      img: './../../assets/images/images.jpg',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
