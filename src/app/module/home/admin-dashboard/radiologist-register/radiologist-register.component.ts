import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminManagementService } from '../admin-management.service';

@Component({
  selector: 'cxr-radiologist-register',
  templateUrl: './radiologist-register.component.html',
  styleUrls: ['./radiologist-register.component.scss']
})

export class RadiologistRegisterComponent implements OnInit {
  addRadiologistForm: FormGroup;
  typeOfRadiologist = ['Hospitalradiologist', 'Individualradiologist'];
  isFormSubmit = false;
  constructor(
    private formBuilder: FormBuilder, 
    private adminManagment: AdminManagementService,
    private toastrService: ToastrService,
    ) {}
  ngOnInit(): void {
    this.addRadiologistForm = this.formBuilder.group(
    {
      userName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
      confirmPassword: ['', [Validators.required]],
      roles: ['', Validators.required]
    },
    {
      validator: MustMatch('password', 'confirmPassword')
    }
    );
  }

  addRadiologists() {
    this.isFormSubmit = true;
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
      ]
    };
    this.adminManagment.addRadiologist(request).subscribe(
      (response) => {
        this.toastrService.success(`${request.userName} is Registered Succesfully`);
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error.ConfirmPassword) {
          this.toastrService.error(errorResponse.error.ConfirmPassword[0]);
          } else if (errorResponse.error.Email) {
          this.toastrService.error(errorResponse.error.Email);
          } else if (errorResponse.error) {
          this.toastrService.error(errorResponse.error);
          } else {
            return;
          }
      });
  }

  resetForm() {
    this.addRadiologistForm.reset();
    this.addRadiologistForm.markAsUntouched();
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
