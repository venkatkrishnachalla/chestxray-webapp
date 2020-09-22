export const homeConstants = {
  patientDashboard: {
    headers: [
      {
        headerName: '',
        field: 'isAnnotated',
        maxWidth: 15,
        cellRenderer: (data) => {
          return '';
        },
        cellStyle: (params) => {
          if (params.value === false) {
            return {
              'border-left': '4px solid red',
              padding: '0',
              'border-radius': '3px',
              height: '95%',
              'margin-top': '1px',
              'margin-left': '7px',
            };
          } else {
            return {
              'border-left': '4px solid green',
              padding: '0',
              'border-radius': '3px',
              height: '95%',
              'margin-top': '1px',
              'margin-left': '7px',
            };
          }
        },
      },
      {
        headerName: 'Report Status',
        field: 'isAnnotated',
        sortable: true,
        cellRenderer: (params) => {
          if (params.value === false) {
            return (
              "<span style='margin-right: 10px !important'><img src='../../assets/images/Drafted.png'  width='15px' height='15px'/></span><span>Not Started</span>"
            );
          } else if (params.value === true) {
            return (
              "<span style='margin-right: 10px !important'><img src='../../assets/images/Reported.png' width='15px' height='15px'/></span><span>Completed</span>"
            );
          }
        },
      },
      {
        headerName: 'Patient Id',
        field: 'hospitalPatientId',
        sortable: true,
      },
      {
        headerName: 'Patient Name',
        field: 'name',
        sortable: true,
      },
      {
        headerName: 'Gender',
        field: 'sex',
        sortable: true,
      },
      { headerName: 'Age', field: 'age', sortable: true, minWidth: 72 },
      {
        headerName: 'Ref. Physician',
        field: 'assignedTo',
        sortable: true,
      },
      {
        headerName: 'Date & Time',
        field: 'lastUpdate',
        sortable: true,
        sort: 'desc',
        cellRenderer: (data) => {
          return data.value ? new Date(data.value).toLocaleString('es-CL') : '';
        },
      },
      {
        headerName: 'Actions',
        field: 'action',
        pinned: 'right',
        resizable: true,
        cellStyle: (params) => {
          return { width: 'auto !important' };
        },
        template: `  
          <img src="../../../../../assets/images/i.png" alt="info_icon" height="20px" width="20px" style="color: #C5C5C5; cursor: pointer; margin-top: 10px; margin-right: 10px;" title="Patient info" title="Patient Info" data-action-type="viewInfo" (click)="patientInfo(e)"/>
          <mat-icon data-action-type="redirect" style="color: #a7a6a6;; cursor: pointer; margin-top: -7px;" title="View X-Ray" (click)="onClick()" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
          arrow_forward_ios</mat-icon>
        </div>`,
      },
    ],
  },
};
