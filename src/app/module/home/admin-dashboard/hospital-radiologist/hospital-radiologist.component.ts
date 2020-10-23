import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/service/dashboard.service';
import User from 'src/app/module/auth/user.modal';
import { HospitalRadiologistService } from 'src/app/service/hospital-radiologist.service';
import { AuthService } from 'src/app/module/auth/auth.service';
import { SpinnerService } from 'src/app/module/shared/UI/spinner/spinner.service';

interface PatientListData {
  data: PatientListData;
  age: number;
  birthDate: string;
  hospitalPatientId: string;
  id: string;
  lastUpdate: string;
  name: string;
  xRayId:any;
  referringPhysicianName: string;
  sex: string;
  status: boolean;
  studies: any[];
  forEach?: any;
  sort?: any;
}

@Component({
  selector: 'cxr-hospital-radiologist',
  templateUrl: './hospital-radiologist.component.html',
  styleUrls: ['./hospital-radiologist.component.scss']
})
export class HospitalRadiologistComponent implements OnInit {
  private userSubscription: Subscription;
  radiologistList: any = [];
  unAssignedPAtients:any =[];
  displayedColumns: string[] = ['userName','role','email','patients','actions'];
  dataSource;
  rowData: PatientListData;
  loading:boolean;

  ShowFilter = false;

  myGroup:FormGroup;
items = [];
showError: boolean;
  showloader: boolean;
  showTable: boolean;
myControl = new FormControl();


  @ViewChild('multiSelect') multiSelect;
  public form: FormGroup;
  public loadContent: boolean = false;
  public name = 'Cricketers';
  public data = [];
  public settings = {};
  public selectedItems = [];
  dropdownSettings: any = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dropdownList = [];
  unselect: any;

  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService,

    public dialog: MatDialog,
    private radiologistService: HospitalRadiologistService,
    private eventEmitterService: EventEmitterService,
    private fb: FormBuilder,
    private dashboardService: DashboardService,

    ) {
      this.selectall = false;
    }

  ngOnInit(): void {
    this.spinnerService.show();

    this.loading = true;

    this.myGroup = new FormGroup({
      patientsAssign: new FormControl()
   })
  this.dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: this.ShowFilter
};

this.setForm();
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          const UserInfo = JSON.parse(JSON.stringify(user));
          sessionStorage.setItem('accessToken', UserInfo._token);
          const tokenNew = window.btoa(UserInfo._token);
          UserInfo._token = tokenNew;
          sessionStorage.setItem('userAuthData', JSON.stringify(UserInfo));
        }
      }
    );
    this.getradiologistList();
    this.getPatientList();

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getradiologistList() {
    this.radiologistService.getradiologistList().subscribe( data => {
      this.radiologistList = data['response'];
      this.radiologistList.forEach(data =>{
        data['xRayList']=[];
        data['patient']=[];
        data['unAssigned']=[];
        data['isselectall']=false;
      })
     
      this.dataSource = new MatTableDataSource(this.radiologistList);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    (errorMessage: string) => {
      this.eventEmitterService.onErrorMessage({
        data: errorMessage,
      });
    }
    );
  }
public setForm() {
  this.form = new FormGroup({
    name: new FormControl(this.data, Validators.required)
  });
  this.loadContent = true;
}

get f() { return this.form.controls; }



  categories = [];
  unAssigned = [];
  gokul=[];
    
  selected = [];
 
  getPatientList() {
    this.showloader = true;
    this.dashboardService.getAdminPatientList('NotAnnotated').subscribe( data => {
      this.loading = false;
      this.spinnerService.hide();

      this.categories = data['data'];
      this.categories.forEach(assign =>{
        this.radiologistList.forEach(foll =>{
          assign['xRayList'].forEach(patientsAssign =>{
            if(patientsAssign.assignedTo == foll.userName){
              foll.patient.push({id:assign.id,name:assign.name})
            }
            if(patientsAssign.assignedTo === null || String){
              foll.unAssigned.push({id:assign.id,name:assign.name,xrayId:assign['xRayList']})
            }
          })
        })
      })
      if(data['data[xRayList.assignedTo]']=null){
        this.categories = data['data'];
    
      }


    },

    );
  
  }

  selectall: boolean;
  languages = new FormControl();

  selectalllang(i) {
    i['xRayList']=[];
    if(i['isselectall']==true){
      i['xRayList']=this.categories;

    }
    else if(i['isselectall'] != true){
      i['xRayList']=[];
    }
   }
   works(i){
     const xRayIds = i.xRayList.map(list =>{
      return list.xrayId.map(lists =>{
         return lists.xRayId
      })[0]

     })
     let assignedTo = i.userName;

     this.dashboardService.isSubmit(xRayIds, assignedTo ).subscribe(res =>{
       location.reload(true);

     })
   }
}
