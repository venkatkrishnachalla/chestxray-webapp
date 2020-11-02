export const adminPatientsConstants = {
    patientDashboard: {
      headers: [
        {
          headerName: '',
          field: 'xRayList',
          maxWidth: 50,
          cellRenderer: (data) => {
            return '';
          },
          cellStyle: (params) => {
            if (params.value[0].isAnnotated === false) {
              return {
                padding: '0',
                'border-radius': '3px',
                height: '95%',
                'margin-top': '1px',
                'margin-left': '7px',
                'width':'50px'
              };
            } else {
              return {
                'border-left': '4px solid green',
                padding: '0',
                'border-radius': '3px',
                height: '95%',
                'margin-top': '1px',
                'margin-left': '7px',
                'width':'50px'
              };
            }
          },
        },
        {
          headerName: 'Patient Id',
          field: 'hospitalPatientId',
          sortable: true,
          minWidth: 200
        },
        {
          headerName: 'Patient Name',
          field: 'name',
          sortable: true,
          minWidth: 200
        },
        {
          headerName: 'Gender',
          field: 'sex',
          sortable: true,
          minWidth: 200
        },
        { headerName: 'Age', field: 'age', sortable: true, minWidth: 200 },
        {
          headerName: 'Assigned Radiologist',
          field: 'xRayList',
          sortable: true,
          cellRenderer: (data) => {
            return data.value[0].assignedTo;
          },
        },
      ],
    },
  };
  