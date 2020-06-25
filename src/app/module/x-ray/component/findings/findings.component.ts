import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss'],
})
export class FindingsComponent implements OnInit {
  findings = ['hello', 'hello', 'hello']
  constructor() {}

  ngOnInit(): void {}
}
