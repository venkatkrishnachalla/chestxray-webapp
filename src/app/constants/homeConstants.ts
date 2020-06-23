export const home_constants = {
  patientDashboard: {
    headers: [
      {
        headerName: '',
        field: 'priority',
        // sortable: true,
        maxWidth: 15,
        cellRenderer: (data) => {
          return '';
        },
        cellStyle: function (params) {
          if (params.value == 'Emergency') {
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
        minWidth: 178,
        cellRenderer: function (params) {
          if (params.value === 'Drafted') {
            return (
              "<span style='margin-right: 10px !important'><img src='../../assets/images/Drafted.png'  width='15px' height='15px'/></span><span>" +
              params.value +
              '</span>'
            );
          } else if (params.value === 'Unreported') {
            return (
              "<span style='margin-right: 10px !important'><img src='../../assets/images/Unreported.png' width='15px' height='15px'/></span><span>" +
              params.value +
              '</span>'
            );
          } else if (params.value === 'Reported') {
            return (
              "<span style='margin-right: 10px !important'><img src='../../assets/images/Reported.png' width='15px' height='15px'/></span><span>" +
              params.value +
              '</span>'
            );
          }
        },
      },
      {
        headerName: 'Patient Id',
        field: 'patientId',
        sortable: true,
        minWidth: 126,
      },
      {
        headerName: 'Patient Name',
        field: 'name',
        sortable: true,
        minWidth: 148,
      },
      {
        headerName: 'Gender',
        field: 'gender',
        sortable: true,
        width: 20,
        minWidth: 113,
      },
      { headerName: 'Age', field: 'age', sortable: true, minWidth: 96 },
      {
        headerName: 'Ref. Doctor',
        field: 'referenceDoctor',
        sortable: true,
        minWidth: 135,
      },
      {
        headerName: 'Date & Time',
        field: 'date',
        sortable: true,
        minWidth: 148,
        cellRenderer: (data) => {
          return data.value ? new Date(data.value).toLocaleString() : '';
        },
      },
      {
        headerName: 'Actions',
        field: 'action',
        pinned: 'right',
        cellStyle: function (params) {
          return { width: 'auto !important' };
        },
        cellRenderer: (data) => {
          return `<mat-icon style="color: #C5C5C5; cursor: pointer; margin-top:10px; margin-right:10px" title="Patient Info" (click)="viewXray(e)" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
                error_outline</mat-icon>
                <mat-icon style="color: #C5C5C5; cursor: pointer; margin-top:10px" title="View X-Ray" (click)="viewXray(e)" class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
                preview</mat-icon>`;
        },
        onCellClicked: function make(params) {
          const patientId = params.data.patientId;
          localStorage.setItem('InstanceUID', patientId);
          window.location.assign('/x-ray');
        },
      },
    ],
  },
};
