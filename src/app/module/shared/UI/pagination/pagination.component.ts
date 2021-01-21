import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { PagerService } from '../../../../service/pager.service';
import { EventEmitterService2 } from 'src/app/service/event-emitter.service2';

@Component({
  selector: 'cxr-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() pageSize = 0;
  @Input() gridApi: GridApi;
  @Input() noOfPages = 0;
  currentPage: number;
  page: number;
  private paginationPages = {
    currentPage: 0, totalPages: 0, startPage: 0, endPage: 0, pages: []
  };

  get PaginationPages() {
    return this.paginationPages;
  }

  get totalPages(): number {
    return this.noOfPages;
  }

  constructor(private pagerService: PagerService,
              private eventEmitterService: EventEmitterService2) { }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'noOfPages') {
        this.paginationPages = this.pagerService.getPager(this.noOfPages, 1);
        this.currentPage = this.paginationPages.currentPage;
      }
    }
  }

  goToPage(index: number) {
    this.currentPage = index;
    this.paginationPages.currentPage = this.currentPage;
    this.gridApi.paginationGoToPage(index);
    this.paginationPages = this.pagerService.getPager(this.noOfPages, index);
    this.getPatientList(index, 10);
  }

  goToNext() {
    if (this.paginationPages.currentPage < this.noOfPages){
      this.currentPage = this.paginationPages.currentPage + 1;
      this.gridApi.paginationGoToNextPage();
      this.paginationPages = this.pagerService.getPager(this.noOfPages, this.paginationPages.currentPage + 1);
      this.getPatientList(this.paginationPages.currentPage, 10);
    }
  }

  goToPrevious() {
    if (this.paginationPages.currentPage  >= this.noOfPages){
      this.currentPage = this.paginationPages.currentPage - 1;
      this.gridApi.paginationGoToPreviousPage();
      this.paginationPages = this.pagerService.getPager(this.noOfPages, this.paginationPages.currentPage - 1);
      this.getPatientList(this.paginationPages.currentPage, 10);
    }
    else if (this.paginationPages.currentPage !== 1){
      this.currentPage = this.paginationPages.currentPage - 1;
      this.gridApi.paginationGoToPreviousPage();
      this.paginationPages = this.pagerService.getPager(this.noOfPages, this.paginationPages.currentPage - 1);
      this.getPatientList(this.paginationPages.currentPage, 10);
    }
  }

  getPatientList(page, size){
    this.eventEmitterService.onPageNumberClick(page, size);
  }
}
