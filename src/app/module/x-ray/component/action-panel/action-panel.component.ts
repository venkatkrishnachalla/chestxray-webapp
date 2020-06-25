import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { actionPanelConstants } from '../../../../constants/actionPanelConstants';
import { Options } from 'ng5-slider';
import { Router } from '@angular/router';
import { TestRequest } from '@angular/common/http/testing';

@Component({
  selector: 'cxr-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss'],
})
export class ActionPanelComponent implements OnInit {
  @Output() askAIEvent = new EventEmitter();
  value = 70;
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#285c68',
      to: '#285c68',
    },
  };

  values = 50;
  option: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#285c68',
      to: '#285c68',
    },
  };

  readonly constants = actionPanelConstants;
  actionPanel: { image: string; alt: string }[];
  middlePanel: { image: string; alt: string }[];
  brightnessPanel: { image: string; alt: string }[];
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.actionPanel = this.constants.actionPanelTop;
    this.middlePanel = this.constants.actionPanelMiddle;
    this.brightnessPanel = this.constants.actionPanelBrightness;
  }

  askAI() {
    this.askAIEvent.emit(true);
  }
}
