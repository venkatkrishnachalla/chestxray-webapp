import { BrowserModule } from '@angular/platform-browser';
import { NgModule, EventEmitter,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './module/auth/auth.module';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { HomeModule } from './module/home/home.module';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from './module/shared/shared.module';
import { XRayModule } from './module/x-ray/x-ray.module';
import { EventEmitterService } from './service/event-emitter.service';
import { EventEmitterService2 } from './service/event-emitter.service2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportModule } from './module/report/report.module';
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule } from 'ngx-toastr';
import { FormatTimePipe } from './filters/format-time.pipe';
import { NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown'
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [AppComponent, FormatTimePipe],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    
    MatProgressSpinnerModule,
    MatProgressBarModule,
    CoreModule,
    HomeModule,
    AuthModule, // Load AuthModule with the app,
    LayoutModule,
    SharedModule,
    XRayModule,
    ReportModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxSpinnerModule,
    NgxPrintModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      timeOut: 3500,
      maxOpened: 1,
      autoDismiss: true,
      preventDuplicates: true,
    }),
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    EventEmitterService,
    EventEmitterService2,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
// AppModule class implementation  
export class AppModule {}
