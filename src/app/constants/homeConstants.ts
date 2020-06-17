export const home_constants = {
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
        cellRenderer: (data) => {
          return data.value ? (new Date(data.value)).toLocaleString() : '';
     }
      },
      // {
      //   headerName: 'Description',
      //   field: 'desc',
      //   sortable: true,
      //   resizable: true,
      // },
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
        width: 120,
        cellRenderer: (data) => {
          return `<mat-icon style="cursor: pointer; margin-top:10px" title="Patient Info" (click)="viewXray(e)" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
                error_outline</mat-icon>
                <mat-icon style="cursor: pointer; padding-left:15px; margin-top:10px" title="View X-Ray" (click)="viewXray(e)" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
                edit</mat-icon>`;
        },
      },
    ]
  }
};
