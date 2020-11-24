// HELPER FOR DATE COMPARISON
function _monthToNum(date) {
  if (date === undefined || date === null || date.length !== 19) {
    return null;
  }

  const yearNumber = date.substring(6, 10);
  const monthNumber = date.substring(3, 5);
  const dayNumber = date.substring(0, 2);

  const hours = date.substring(11, 13);
  const minutes = date.substring(14, 16);
  const seconds = date.substring(17, 19);

  const result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
  // 29/08/2004 => 20040829
  return result;
}

export const homeConstants = {
  patientDashboard: {
    headers: [
      {
        headerName: '',
        field: 'xRayList',
        maxWidth: 15,
        cellRenderer: (data) => {
          return '';
        },
        cellStyle: (params) => {
          if (params.value[0].isAnnotated === false) {
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
        field: 'xRayList',
        sortable: true,
        sort: 'desc',
        cellRenderer: (params) => {
          if (params.value[0].isAnnotated === false) {
            return (
              '<span style=\'margin-right: 10px !important\'><img src=\'../../assets/images/Drafted.png\'  width=\'15px\' height=\'15px\'/></span><span>Not Started</span>'
            );
          } else if (params.value[0].isAnnotated === true) {
            return (
              '<span style=\'margin-right: 10px !important\'><img src=\'../../assets/images/Reported.png\' width=\'15px\' height=\'15px\'/></span><span>Completed</span>'
            );
          }
        },
        comparator: (valueA, valueB) => {
            if (valueA[0].isAnnotated === valueB[0].isAnnotated) {
                return 0;
            } else {
                return (valueA[0].isAnnotated < valueB[0].isAnnotated) ? 1 : -1;
            }
        }
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
        field: 'xRayList',
        sortable: true,
        cellRenderer: (data) => {
          return data.value[0].assignedTo;
        },
      },
      {
        headerName: 'Date & Time',
        field: 'xRayList',
        sortable: true,
        cellRenderer: (data) => {
          return data.value[0].lastUpdate ? new Date(data.value[0].lastUpdate).toLocaleString('es-CL') : '';
        },
        comparator: (valueA, valueB) => {
          const date1Number = _monthToNum(new Date(valueA[0].lastUpdate).toLocaleString('es-CL'));
          const date2Number = _monthToNum(new Date(valueB[0].lastUpdate).toLocaleString('es-CL'));
          if (date1Number === null && date2Number === null) {
            return 0;
          }
          if (date1Number === null) {
            return -1;
          }
          if (date2Number === null) {
            return 1;
          }

          return date1Number - date2Number;
        }
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
