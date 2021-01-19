import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminManagementService } from '../admin-management.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventEmitterService2 } from '../../../../service/event-emitter.service2';
@Component({
  selector: 'cxr-radiologist-register',
  templateUrl: './radiologist-register.component.html',
  styleUrls: ['./radiologist-register.component.scss']
})

export class RadiologistRegisterComponent implements OnInit {
  addRadiologistForm: FormGroup;
  typeOfRadiologist = ['Hospitalradiologist', 'Individualradiologist'];
  isFormSubmit = false;
  isClose:boolean= true;
  constructor(
    private formBuilder: FormBuilder, 
    private adminManagment: AdminManagementService,
    private toastrService: ToastrService,
    private matdialouge:MatDialog,
    private matdialougeref:MatDialogRef<any>,
    private EventEmitterService2: EventEmitterService2
    ) {}
  ngOnInit(): void {
    this.addRadiologistForm = this.formBuilder.group(
    {
      userName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
      confirmPassword: ['', [Validators.required]],
      roles: ['', Validators.required],
      confirmExpiry: [],
      confirmDob: []
    },
    {
      validator: MustMatch('password', 'confirmPassword')
    }
    );
  }

  addRadiologists() {
    if (this.addRadiologistForm.invalid) {
      return;
    }
    const request = {
      userName: this.addRadiologistForm.value.userName,
      email: this.addRadiologistForm.value.email,
      password: this.addRadiologistForm.value.password,
      confirmPassword: this.addRadiologistForm.value.confirmPassword,
      roles: [
        this.addRadiologistForm.value.roles
      ],
      expiryDate: this.addRadiologistForm.value.confirmExpiry,
      dateOfBirth: this.addRadiologistForm.value.confirmDob,
    };
    this.adminManagment.addRadiologist(request).subscribe(
      (response) => {
        this.EventEmitterService2.refreshRadiologistList();
        this.toastrService.success(`${request.userName} is Registered Succesfully`);
        this.isFormSubmit = true;
        this.matdialougeref.close(this.isClose);
        this.matdialouge.closeAll();
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error.ConfirmPassword) {
          this.matdialougeref.close(this.isClose);
          this.toastrService.error(errorResponse.error.ConfirmPassword[0]);
          } else if (errorResponse.error.Email) {
            this.matdialougeref.close(this.isClose);

          this.toastrService.error(errorResponse.error.Email);
          } 
          else if (errorResponse.error) {
            if(errorResponse.error !== "Username is already taken."){
              this.matdialougeref.close(this.isClose);
            }
          this.toastrService.error(errorResponse.error);
          } else {
            this.matdialougeref.close(this.isClose);
            return;
          }
      });
  }

  resetForm() {
    this.addRadiologistForm.reset();
    this.addRadiologistForm.markAsUntouched();
  }
  close(){
    this.matdialougeref.close(this.isClose);
    this.matdialouge.closeAll();
  }
  /**
   * This is a get today date to disable future dates in date picker.
   * @param '{void}' empty - A empty param
   * @example
   * getToday();
   */

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
  const control = formGroup.controls[controlName];
  const matchingControl = formGroup.controls[matchingControlName];
  
  if (matchingControl.errors && !matchingControl.errors.mustMatch) {
  // return if another validator has already found an error on the matchingControl
  return;
  }
  
  // set error on matchingControl if validation fails
  if (control.value !== matchingControl.value) {
  matchingControl.setErrors({ mustMatch: true });
  } else {
  matchingControl.setErrors(null);
  }
  };
}
