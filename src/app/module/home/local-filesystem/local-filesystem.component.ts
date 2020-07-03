import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.uploadImageForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      gender: ['male', Validators.required],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.maxLength(10)]],
      address: [''],
      XRayImage: this.formBuilder.group({
        file: ['', Validators.required],
        fileSource: [''],
      }),
    });
  }
  
  get f() {
    return this.uploadImageForm.controls;
  }

  /* on changing file */

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

  dragDropEvent(event) {
    this.imageSource = event;
  }

  onSubmit() {
    this.submitted = true;
    if (this.uploadImageForm.invalid) {
      return;
    }
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.uploadImageForm.value));
  }
}
