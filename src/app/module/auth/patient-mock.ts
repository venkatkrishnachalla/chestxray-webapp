export const patientMock: any[] = [
  {
    patientId: 12,
    name: 'Krishna',
    gender: 'M',
    age: 56,
    priority: 'Minor',
    referenceDoctor: 'Corkery, Charley DDS',
    date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
    desc: 'Testing',
    status: 'in-process',
    instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08',
    hospitalPatientId: '1010',
    isAnnotated: true,
    xRayList: [
      {
        xRayId: 68,
        lastUpdate: '2020-10-16T12:39:06.222349',
        isAnnotated: true,
        assignedTo: 'mohan',
      },
    ],
  },
  {
    patientId: 14,
    name: 'Pramoda',
    gender: 'M',
    age: 26,
    priority: 'Major',
    referenceDoctor: 'Corkery, Charley DDS',
    date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
    desc: 'Testing',
    status: 'in-process',
    instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8gd08',
    hospitalPatientId: '1011',
    isAnnotated: true,
    xRayList: [
      {
        xRayId: 68,
        lastUpdate: '2020-10-16T12:39:06.222349',
        isAnnotated: true,
        assignedTo: 'mohan',
      },
    ],
  },
];

export const patientObjectMock: any = {
   data: [
    {
      patientId: 12,
      name: 'Krishna',
      gender: 'M',
      age: 56,
      priority: 'Minor',
      referenceDoctor: 'Corkery, Charley DDS',
      date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
      desc: 'Testing',
      status: 'in-process',
      instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08',
      hospitalPatientId: '1010',
      isAnnotated: true,
      xRayList: [
        {
          xRayId: 68,
          lastUpdate: '2020-10-16T12:39:06.222349',
          isAnnotated: true,
          assignedTo: 'mohan',
        },
      ],
    },
    {
      patientId: 14,
      name: 'Pramoda',
      gender: 'M',
      age: 26,
      priority: 'Major',
      referenceDoctor: 'Corkery, Charley DDS',
      date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
      desc: 'Testing',
      status: 'in-process',
      instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8gd08',
      hospitalPatientId: '1011',
      isAnnotated: true,
      xRayList: [
        {
          xRayId: 68,
          lastUpdate: '2020-10-16T12:39:06.222349',
          isAnnotated: true,
          assignedTo: 'mohan',
        },
      ],
    },
  ],
};

export const canvasMock: any = {
  getActiveObject: () => {
    return {
      id: 1,
      canvas: {
        freeDrawingBrush: {
          _points: ['2345'],
        },
      },
      set: () => {},
    };
  },
  setDimensions: () => {},
  setWidth: () => {},
  setHeight: () => {},
  bind: () => {},
  renderAll: () => {},
  clear: () => {},
  setBackgroundImage: () => {},
  remove: () => {},
  discardActiveObject: () => {},
  isDrawingMode: true,
  freeDrawingBrush: {
    width: '',
    color: '',
  },
  observe: () => {},
  forEachObject: () => {},
  add: () => {},
  _activeObject: {
    path: '/x-ray',
  },
};

export const patientMockInstanceId: any[] = [
  {
    accessionNumber: '',
    id: '9cb6a32f-93a4cee8-ee9f0ef3-3cc29b03-f6a0bfe8',
    referringPhysicianName: 'mohan',
    seriesList: [
      {
        bodyPartExamined: null,
        id: '9b247ba4-b9899974-878bb3e3-001ed405-48084c1f',
        instanceList: [
          {
            id: '42066719-369f0249-189d2017-c3bd3f57-11fc78d6',
            instanceNumber: 0,
            instanceDate: '0001-01-01T00:00:00',
          },
        ],
        seriesDate: '0001-01-01T00:00:00',
        seriesDescription: null,
        seriesNumber: 0,
      },
    ],
    studyDate: '2019-11-11T00:00:00',
    studyDescription: null,
  },
];
