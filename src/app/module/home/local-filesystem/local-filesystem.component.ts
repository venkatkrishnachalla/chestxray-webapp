import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'cxr-local-filesystem',
  templateUrl: './local-filesystem.component.html',
  styleUrls: ['./local-filesystem.component.scss'],
})
export class LocalFilesystemComponent implements OnInit {
  uploadImageForm: FormGroup;
  submitted: boolean;
  imageWidth: any;
  images = [];
  fileName = 'Choose file';
  imageSource: string;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  /*** class init function ***/
  ngOnInit(): void {
    this.uploadImageForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      gender: ['M', Validators.required],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.maxLength(10)]],
      address: [''],
      file: ['', Validators.required],
      XRayImage: this.formBuilder.group({
        file: [''],
        fileSource: [''],
      }),
    });
  }

  get f() {
    return this.uploadImageForm.controls;
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  /*** on image file changing event ***/
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.fileName = event.target.files[0].name.toString();
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageSource = event.target.result;
          this.images.push(event.target.result);
          this.uploadImageForm.patchValue({
            fileSource: this.images,
            file: this.fileName,
          });
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  /*** capture drag and drop of image ***/
  dragDropEvent(event) {
    this.imageSource = event;
  }

  /*** capture drag and drop of image file event ***/
  dragDropFile(event) {
    this.fileName = event.name.toString();
    this.uploadImageForm.patchValue({
      fileSource: this.images,
      file: event,
    });
    this.uploadImageForm.controls.file.setValue(this.fileName);
  }

  /*** new patient form submit ***/
  onSubmit() {
    this.submitted = true;
    if (this.uploadImageForm.invalid) {
      return;
    }
    this.uploadImageForm.value.age = 26;
    this.uploadImageForm.value.sex = this.uploadImageForm.value.gender;
    this.uploadImageForm.value.lastUpdate = new Date();
    this.uploadImageForm.value.referringPhysicianName = 'Ramesh';
    const patientDetail = JSON.stringify(this.uploadImageForm.value);
    sessionStorage.setItem('patientDetail', patientDetail);
    sessionStorage.setItem('PatientImage', this.imageSource);
    sessionStorage.setItem('isIndividualRadiologist', 'true');
    window.location.assign('/x-ray');
  }
}
