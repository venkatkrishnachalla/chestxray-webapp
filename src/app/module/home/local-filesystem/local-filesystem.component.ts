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
  // files: any[];
  images = [];
  fileName = 'Choose file';
  constructor(private formBuilder: FormBuilder) {
  }

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
        fileSource: ['']
      })
    });
  }
  get f() {
    return this.uploadImageForm.controls;
  }

  // on changing file
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.fileName = event.target.files[0].name.toString();
      const filesAmount = event.target.files.length;
      // tslint:disable-next-line: no-console
      console.log(filesAmount);
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        // tslint:disable-next-line: no-shadowed-variable
        reader.onload = (event: any) => {
          // tslint:disable-next-line: no-console
          console.log(event.target.result);
          this.images.push(event.target.result);
          this.uploadImageForm.patchValue({
            fileSource: this.images,
          });
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.uploadImageForm.invalid) {
      return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.uploadImageForm.value));
  }
}
