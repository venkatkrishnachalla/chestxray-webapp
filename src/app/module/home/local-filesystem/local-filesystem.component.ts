import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'cxr-local-filesystem',
  templateUrl: './local-filesystem.component.html',
  styleUrls: ['./local-filesystem.component.scss'],
})
export class LocalFilesystemComponent implements OnInit {
  private userSubscription: Subscription;
  uploadImageForm: FormGroup;
  submitted: boolean;
  imageWidth: any;
  images = [];
  fileName = 'Choose file';
  imageSource: string;
  doctorName: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  /*** class init function ***/
  ngOnInit(): void {
    this.uploadImageForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      gender: ['M', Validators.required],
      email: ['', [Validators.email]],
      phoneNumber: [
        '',
        [Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      address: [''],
      file: ['', Validators.required],
      XRayImage: this.formBuilder.group({
        file: [''],
        fileSource: [''],
      }),
    });
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: any) => {
        if (user) {
          this.doctorName = user.username;
        }
      }
    );
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
        // tslint:disable-next-line: no-shadowed-variable
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
      file: this.fileName,
    });
  }

  /*** new patient form submit ***/

  onSubmit() {
    this.submitted = true;
    if (this.uploadImageForm.invalid) {
      return;
    }
    this.uploadImageForm.value.sex = this.uploadImageForm.value.gender;
    this.uploadImageForm.value.lastUpdate = new Date();
    this.uploadImageForm.value.referringPhysicianName = this.doctorName;
    this.uploadImageForm.value.imageSource = this.imageSource;
    this.uploadImageForm.value.hospitalPatientId = '';
    this.uploadImageForm.value.isIndividualRadiologist = true;
    const date = new Date(this.uploadImageForm.value.dateOfBirth);
    const timeDiff = Math.abs(Date.now() - date.getTime());
    this.uploadImageForm.value.age = Math.floor(
      timeDiff / (1000 * 3600 * 24) / 365
    );
    this.router.navigate(['/x-ray'], {
      state: { patientDetails: this.uploadImageForm.value },
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
