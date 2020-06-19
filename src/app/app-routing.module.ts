import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { SignInComponent } from './module/auth/sign-in/sign-in.component';
import { SignUpComponent } from './module/auth/sign-up/sign-up.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
import { DashboardComponent } from './module/home/dashboard/dashboard.component';
import { MyAccountComponent } from './module/home/my-account/my-account.component';
import { ChatRoomComponent } from './module/home/chat-room/chat-room.component';
import { CalendarComponent } from './module/home/calendar/calendar.component';
import { SettingsComponent } from './module/home/settings/settings.component';
import { XRayComponent } from './module/x-ray/x-ray.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: SignInComponent,
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'register',
        component: SignUpComponent,
      },
    ],
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'my-account', component: MyAccountComponent },
      { path: 'chat-room', component: ChatRoomComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  {
    path: 'x-ray',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [{ path: '', component: XRayComponent }],
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  // Fallback when no prior routes is matched
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
