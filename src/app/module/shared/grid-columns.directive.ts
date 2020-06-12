import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatGridList } from '@angular/material/grid-list';

export interface GridColumns {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

@Directive({
  selector: '[cxrGridColumns]'
})

export class GridColumnsDirective implements OnInit {
  private cxrGridColumns: GridColumns = {xs: 1, sm: 2, md: 4, lg: 6, xl: 8};

  public get cols(): GridColumns {
    return this.cxrGridColumns;
  }

  @Input('cxrGridColumns')
  public set cols(map: GridColumns) {
    if (map && ('object' === (typeof map))) {
      this.cxrGridColumns = map;
    }
  }

  public constructor(private grid: MatGridList, private breakpointObserver: BreakpointObserver) {
    if (this.grid != null) {
      this.grid.cols = this.cxrGridColumns.md;
    }
  }
  public ngOnInit(): void {
    if (this.grid != null) {
      this.grid.cols = this.cxrGridColumns.md;
    }
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {

      if (result.breakpoints[Breakpoints.XSmall]) {
        this.grid.cols = this.cxrGridColumns.xs;
      }
      if (result.breakpoints[Breakpoints.Small]) {
        this.grid.cols = this.cxrGridColumns.sm;
      }
      if (result.breakpoints[Breakpoints.Medium]) {
        this.grid.cols = this.cxrGridColumns.md;
      }
      if (result.breakpoints[Breakpoints.Large]) {
        this.grid.cols = this.cxrGridColumns.lg;
      }
      if (result.breakpoints[Breakpoints.XLarge]) {
        this.grid.cols = this.cxrGridColumns.xl;
      }
    });
  }
}
