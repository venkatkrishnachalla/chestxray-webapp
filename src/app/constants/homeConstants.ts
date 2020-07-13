export const homeConstants = {
  patientDashboard: {
    headers: [
      {
        headerName: '',
        field: 'priority',
        maxWidth: 15,
        cellRenderer: (data) => {
          return '';
        },
        cellStyle: (params) => {
          if (params.value === 'Emergency') {
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
              'border-left': '4px solid #A5C3C9',
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
        field: 'status',
        sortable: true,
        minWidth: 124,
        cellRenderer : (params) => {
          if (params.value === 'Drafted') {
            return (
              '<span style=\'margin-right: 10px !important\'><img src=\'../../assets/images/Drafted.png\'  width=\'15px\' height=\'15px\'/></span><span>' +
              params.value +
              '</span>'
            );
          } else if (params.value === 'Unreported') {
            return (
              '<span style=\'margin-right: 10px !important\'><img src=\'../../assets/images/Unreported.png\' width=\'15px\' height=\'15px\'/></span><span>' +
              params.value +
              '</span>'
            );
          } else if (params.value === 'Reported') {
            return (
              '<span style=\'margin-right: 10px !important\'><img src=\'../../assets/images/Reported.png\' width=\'15px\' height=\'15px\'/></span><span>' +
              params.value +
              '</span>'
            );
          } else if (params.value === false) {
            return '<span style=\'margin-right: 10px !important\'><img src=\'../../assets/images/Drafted.png\'  width=\'15px\' height=\'15px\'/></span><span>invalid</span>';
          }
        },
      },
      {
        headerName: 'Patient Id',
        field: 'hospitalPatientId',
        sortable: true,
        minWidth: 102,
      },
      {
        headerName: 'Patient Name',
        field: 'name',
        sortable: true,
        minWidth: 124,
      },
      {
        headerName: 'Gender',
        field: 'sex',
        sortable: true,
        minWidth: 89,
      },
      { headerName: 'Age', field: 'age', sortable: true, minWidth: 72 },
      {
        headerName: 'Ref. Doctor',
        field: 'referringPhysicianName',
        sortable: true,
        minWidth: 111,
      },
      {
        headerName: 'Date & Time',
        field: 'lastUpdate',
        sortable: true,
        minWidth: 117,
        cellRenderer: (data) => {
          return data.value ? new Date(data.value).toLocaleString() : '';
        },
      },
      {
        headerName: 'Actions',
        field: 'action',
        pinned: 'right',
        resizable: true,
        minWidth: 100,
        cellStyle: (params) => {
          return { width: 'auto !important' };
        },
        template: `
          <mat-icon data-action-type="viewInfo" style="color: #C5C5C5; cursor: pointer; margin-top:10px; margin-right:10px" title="Patient Info" (click)="patientInfo(e)" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
          error_outline</mat-icon>
          <mat-icon data-action-type="redirect" style="color: #C5C5C5; cursor: pointer; margin-top:10px" title="View X-Ray" (click)="onClick()" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
          arrow_forward_ios</mat-icon>
        </div>`
        // cellRenderer: (data) => {
        //   return `<mat-icon style="color: #C5C5C5; cursor: pointer; margin-top:10px; margin-right:10px" title="Patient Info" (click)="viewXray(e)" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
        //         error_outline</mat-icon>
        //         <mat-icon style="color: #C5C5C5; cursor: pointer; margin-top:10px" title="View X-Ray" (click)="viewXray(e)" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
        //         arrow_forward_ios</mat-icon>`;
        // },
        // onCellClicked: function make(params) {
        //   const patientDetail = JSON.stringify(params.data);
        //   sessionStorage.setItem('patientDetail', patientDetail);
        //   window.location.assign('/x-ray');
        // },
      },
    ],
  },
};
