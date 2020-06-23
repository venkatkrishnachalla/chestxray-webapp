import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'cxr-x-ray',
  templateUrl: './x-ray.component.html',
  styleUrls: ['./x-ray.component.scss'],
})
export class XRayComponent implements OnInit {
  value = 70;
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true, 
  };

  values = 50;
  option: Options = {
    floor: 0,
    ceil: 100,
    vertical: true
  };

  PatientName = 'Shilpa R.';
  PatientGender = 'F';
  PatientAge = '45yrs';
  refPhysician = 'Dr.Adam Walt';
  Date = '18-05-2020';
  Time = '16:15:30';
  History =
    'lorem ipsum sit amet, consetetur sadipscing, sed diam nonumy eirmod';
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
