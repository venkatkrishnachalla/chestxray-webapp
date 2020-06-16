export const home_Constants = {
  patientDashboard: {
    headers: [
      {
        headerName: 'Patient Id',
        field: 'patientId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Patient Name',
        field: 'name',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Gender',
        field: 'gender',
        sortable: true,
        resizable: true,
      },
      { headerName: 'Age', field: 'age', sortable: true, resizable: true },
      {
        headerName: 'Priority',
        field: 'priority',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Ref. Doctor',
        field: 'referenceDoctor',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Date & Time',
        field: 'date',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Description',
        field: 'desc',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Report Status',
        field: 'status',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Action',
        field: 'action',
        pinned: 'right',
        width: 95,
        cellRenderer: (data) => {
          return `<mat-icon style="cursor: pointer; margin-top:10px" title="Patient Information" (click)="viewXray(e)" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
                info</mat-icon><mat-icon style="cursor: pointer;margin-left:10px; margin-top:10px" title="View X-Ray" (click)="viewXray(e)" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
                preview</mat-icon>`;
        },
      },
    ]
  }
};
