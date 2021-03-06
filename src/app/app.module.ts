import { BrowserModule } from '@angular/platform-browser';
import { NgModule, EventEmitter } from '@angular/core';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportModule } from './module/report/report.module';
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule } from 'ngx-toastr';
import { FormatTimePipe } from './filters/format-time.pipe';
@NgModule({
  declarations: [AppComponent, FormatTimePipe],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
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
    NgxPrintModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      timeOut: 3500,
      maxOpened: 1,
      autoDismiss: true,
      preventDuplicates: true,
    }),
  ],
  providers: [
    EventEmitterService, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
// AppModule class implementation  
export class AppModule {}
