import { ReportFooterComponent } from './report-footer.component';

describe('ReportFooterComponent', () => {
  let component: ReportFooterComponent;

  beforeEach(() => {
    component = new ReportFooterComponent();
  });

  /*** should create report footer component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** should call ngOnInit function ***/
  it('should call ng on init', () => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });
});
