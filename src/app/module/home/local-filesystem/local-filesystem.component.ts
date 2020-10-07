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
// LocalFilesystemComponent class implementation
export class LocalFilesystemComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  uploadImageForm: FormGroup;
  submitted: boolean;
  images = [];
  fileName = 'Choose file';
  imageSource: string;
  doctorName: string;
  radiologistName: string;
  emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @ViewChild(DragDropComponent) dragAndDrop: DragDropComponent;

  /*
   * constructor for LocalFilesystemComponent class
   */

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * This is a init function, retrieve current user details.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

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
          const UserInfo = JSON.parse(JSON.stringify(user));
          sessionStorage.setItem('accessToken', UserInfo._token);
          const tokenNew = window.btoa(UserInfo._token);
          UserInfo._token = tokenNew;
          sessionStorage.setItem('userAuthData', JSON.stringify(UserInfo));
          this.doctorName = 'Dr ' + user.username;
          this.radiologistName = user.username;
        }
      }
    );
  }

  /**
   * This is a f function.
   * @param '{void}' empty - A empty param
   * @example
   * f();
   */

  get f() {
    return this.uploadImageForm.controls;
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

  /**
   * This is on image file changing event.
   * @param '{string}' value - A string param
   * @example
   * onFileChange(event);
   */

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

  /**
   * This is on capture drag and drop of image.
   * @param '{string}' value - A string param
   * @example
   * dragDropEvent(event);
   */

  dragDropEvent(event) {
    this.imageSource = event;
  }

  /**
   * This is on capture drag and drop of image file event.
   * @param '{string}' value - A string param
   * @example
   * dragDropFile(event);
   */

  dragDropFile(event) {
    this.fileName = event.name.toString();
    this.uploadImageForm.patchValue({
      fileSource: this.images,
      file: this.fileName,
    });
  }

  /**
   * This is on new patient form submit.
   * @param '{void}' empty - A empty param
   * @example
   * onSubmit();
   */

  onSubmit() {
    this.submitted = true;
    if (this.uploadImageForm.invalid) {
      return;
    }
    this.uploadImageForm.value.sex = this.uploadImageForm.value.gender;
    this.uploadImageForm.value.lastUpdate = new Date();
    this.uploadImageForm.value.assignedTo = this.doctorName;
    this.uploadImageForm.value.imageSource = this.imageSource;
    this.uploadImageForm.value.hospitalPatientId = '';
    this.uploadImageForm.value.isIndividualRadiologist = true;
    this.uploadImageForm.value.status = false;
    this.uploadImageForm.value.xRayList = [
      {
        assignedTo: this.radiologistName,
        isAnnotated: false,
        lastUpdate: new Date(),
        xRayId: 0,
      },
    ];
    const date = new Date(this.uploadImageForm.value.dateOfBirth);
    const timeDiff = Math.abs(Date.now() - date.getTime());
    this.uploadImageForm.value.age = Math.floor(
      timeDiff / (1000 * 3600 * 24) / 365
    );
    const imageResponse = {
      base64Image: this.imageSource,
      filename: '',
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
      assignedTo: this.doctorName,
      hospitalPatientId: '',
      isIndividualRadiologist: true,
      status: false,
      age: this.uploadImageForm.value.age,
      xRayList: [
        {
          assignedTo: this.radiologistName,
          isAnnotated: false,
          lastUpdate: new Date(),
          xRayId: 0,
        },
      ],
    };
    sessionStorage.setItem('patientRows', JSON.stringify([]));
    sessionStorage.setItem('PatientImage', JSON.stringify(imageResponse));
    sessionStorage.setItem('patientDetail', JSON.stringify(patientDetail));
    sessionStorage.setItem('askAiSelection', 'false');
    sessionStorage.removeItem('x-ray_Data');
    sessionStorage.removeItem('impression');
    sessionStorage.removeItem('findings');
    this.router.navigate(['/x-ray'], {
      state: { patientDetails: this.uploadImageForm.value },
    });
  }

  /**
   * This is on unsubscribe user subscription after moving out from this component
   * @param '{void}' empty - A empty param
   * @example
   * ngOnDestroy();
   */

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
