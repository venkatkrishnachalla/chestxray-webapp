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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
@NgModule({
  declarations: [AppComponent],
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
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    EventEmitterService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
