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
      gender: ['male', Validators.required],
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
      file: event
    });
    this.uploadImageForm.controls.file.setValue(event);
   // console.log('this.uploadImageForm', this.uploadImageForm);
  }

  /*** new patient form submit ***/
  onSubmit() {
    this.submitted = true;
    if (this.uploadImageForm.invalid) {
      return;
    }
    const patientData = JSON.stringify(this.uploadImageForm.value);
    localStorage.setItem('InstanceUID', patientData);
    sessionStorage.setItem('patientImage', this.imageSource);
    this.router.navigate(['/x-ray']);
  }
}
