import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import User from '../../auth/user.modal';

@Component({
  selector: 'cxr-local-filesystem',
  templateUrl: './local-filesystem.component.html',
  styleUrls: ['./local-filesystem.component.scss'],
})
export class LocalFilesystemComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  uploadImageForm: FormGroup;
  submitted: boolean;
  images = [];
  fileName = 'Choose file';
  imageSource: string;
  doctorName: string;
  emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @ViewChild(DragDropComponent) dragAndDrop: DragDropComponent;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  /*** class init function ***/
  ngOnInit(): void {
    this.uploadImageForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)],
      ],
      dateOfBirth: ['', Validators.required],
      gender: ['MALE', Validators.required],
      email: [
        '',
        [
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
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
      (user: User) => {
        if (user) {
          this.doctorName = user.username;
        }
      }
    );
  }

  get f() {
    return this.uploadImageForm.controls;
  }

  /*** get today date to disable future dates in date picker ***/
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
          this.dragAndDrop.getLocalImageSrc(this.imageSource);
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
    this.uploadImageForm.value.status = false;
    const date = new Date(this.uploadImageForm.value.dateOfBirth);
    const timeDiff = Math.abs(Date.now() - date.getTime());
    this.uploadImageForm.value.age = Math.floor(
      timeDiff / (1000 * 3600 * 24) / 365
    );
    const imageResponse = {
      base64Image: this.imageSource,
      filename: this.fileName,
    };
    const patientDetail = {
      name: this.uploadImageForm.value.name,
      address: this.uploadImageForm.value.address,
      dateOfBirth: this.uploadImageForm.value.dateOfBirth,
      email: this.uploadImageForm.value.email,
      phoneNumber: this.uploadImageForm.value.phoneNumber,
      gender: this.uploadImageForm.value.gender,
      sex: this.uploadImageForm.value.sex,
      lastUpdate: new Date(),
      referringPhysicianName: this.doctorName,
      hospitalPatientId: '',
      isIndividualRadiologist: true,
      status: false,
      age: this.uploadImageForm.value.age,
    };
    sessionStorage.setItem('PatientImage', JSON.stringify(imageResponse));
    sessionStorage.setItem('patientDetail', JSON.stringify(patientDetail));
    this.router.navigate(['/x-ray'], {
      state: { patientDetails: this.uploadImageForm.value },
    });
  }

  /*** unsubscribe user subscription after moving out from this component ***/
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
