import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DashboardService } from 'src/app/service/dashboard.service';
import User from 'src/app/module/auth/user.modal';
import { HospitalRadiologistService } from 'src/app/service/hospital-radiologist.service';
import { AuthService } from 'src/app/module/auth/auth.service';

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
// selected = [];
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
    public dialog: MatDialog,
    private radiologistService: HospitalRadiologistService,
    private eventEmitterService: EventEmitterService,
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    // private spinner: NgxSpinnerService

    ) {
      this.selectall = false;
    }

  ngOnInit(): void {
    // this.spinner.show();
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
          console.log(UserInfo)
        }
      }
    );
    this.getradiologistList();
    this.getPatientList();
    // this.getunassignedPatientList()

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
      console.log(data)
      this.radiologistList = data['response'];
      this.radiologistList.forEach(data =>{
        data['xRayList']=[];
        data['patient']=[];
        data['unAssigned']=[];
        data['isselectall']=false;
      })
     
      console.log(this.radiologistList);
      this.dataSource = new MatTableDataSource(this.radiologistList);
      console.log(this.dataSource);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    (errorMessage: string) => {
        //  this.showloader = false;
        // this.showTable = false;
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

public save() {
  console.log(this.form.value);
}

// public resetForm() {
//   this.setForm();
//   this.multiSelect.toggleSelectAll();

// }

public onFilterChange(item: any) {
  console.log(item);
}
public onDropDownClose(item: any) {
  console.log(item);
}

public onItemSelect(item: any) {
  console.log(item);
}
public onDeSelect(item: any) {
  console.log(item);
}
public onDeSelectAll(items: any) {
  console.log(items);
}
  onSelectAll(items: any) {
    console.log(items);
  }
  onItemDeSelect(item: any) {
    console.log(item);
  }
  categories = [];
  unAssigned = [];
  gokul=[];
    
  selected = [];
   
  getSelectedValue(){
    console.log(this.selected);
  }
  getPatientList() {
    this.showloader = true;
    // this.showTable = false;
    this.dashboardService.getAdminPatientList('NotAnnotated').subscribe( data => {
      console.log(data)
      this.loading = false;
      // this.spinner.hide();
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
        // this.categories.forEach(unAssign =>{
        //  console.log(unAssign)
        //  unAssign['xRayList'].forEach(unA =>{
        //    console.log(unA)
        //    if(unA.assignedTo == null) {
        //      console.log(unA)
        //      unA.unAssign.push({id:unAssign.id,name:assign.name})
        //    }
        //  })
        // })
        




        // this.showTable = true;
        // this.showError = false;
      })
      if(data['data[xRayList.assignedTo]']=null){
        console.log(data)
        this.categories = data['data'];
        console.log(this.categories,"500")
        // this.spinner.hide();
        // this.showloader = false;
        // this.showTable = true;
        // this.showError = false;
    
      }

      console.log(this.radiologistList)

    },

    );
  
    this.categories.forEach(data =>{
      console.log(data)
    })
  }
  // getunassignedPatientList(){
  //   this.dashboardService.unassignedPatientList().subscribe( data => {
  //     console.log(data)
  //   })
  // }

  getSelectedOptions(items){
    console.log("items")
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
    console.log(i, this.radiologistList)
   }
   works(i){
     console.log("clicked", i)
     const xRayIds = i.xRayList.map(list =>{
      return list.xrayId.map(lists =>{
        console.log(lists.xRayId)
         return lists.xRayId
      })[0]

     })
     let assignedTo = i.userName;

     this.dashboardService.isSubmit(xRayIds, assignedTo ).subscribe(res =>{
       console.log(res)
       location.reload(true);

     })

    // const xray =  xRayIds.map(lists =>{
    //   console.log(lists)
    //    return lists[0].xRayId
    //  })
     console.log(xRayIds)

    //  let xRayId = i.forEach(['xRayList']['xrayId'].xRayId)
     console.log(assignedTo)
   }
   onSubmit(opened: boolean) {
    console.log(opened ? 'opened' : 'closed');
}
}
