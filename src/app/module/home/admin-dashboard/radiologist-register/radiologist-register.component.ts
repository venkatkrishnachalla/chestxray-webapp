import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminManagementService } from '../admin-management.service';

@Component({
  selector: 'cxr-radiologist-register',
  templateUrl: './radiologist-register.component.html',
  styleUrls: ['./radiologist-register.component.scss']
})

export class RadiologistRegisterComponent implements OnInit {
  addRadiologistForm: FormGroup;
  typeOfRadiologist = ['Hospitalradiologist', 'Individualradiologist'];
  constructor(private formBuilder: FormBuilder, private adminManagment: AdminManagementService) {}
  ngOnInit(): void {
    this.addRadiologistForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      roles: [['Hospitalradiologist']]
    });
  }

  addRadiologists() {
    // this.adminManagment.addRadiologist(this.addRadiologistForm.value).subscribe((response) => {
    //   // tslint:disable-next-line: no-console
    //   console.log('Response', response);
    // });
  }
}
