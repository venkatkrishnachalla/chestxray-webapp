import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { SignInComponent } from './module/auth/sign-in/sign-in.component';
import { SignUpComponent } from './module/auth/sign-up/sign-up.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { HomeComponent } from './module/home/home.component';
import { AuthGuard } from './core/guard/auth.guard';
import { DashboardComponent } from './core/layout/component/dashboard/dashboard.component';
import { MyAccountComponent } from './core/layout/component/my-account/my-account.component';
import { ChatRoomComponent } from './core/layout/component/chat-room/chat-room.component';
import { CalendarComponent } from './core/layout/component/calendar/calendar.component';
import { SettingsComponent } from './core/layout/component/settings/settings.component';

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
    children: [{ path: '', component: HomeComponent }],
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [{ path: 'my-account', component: MyAccountComponent}]
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [{path: 'chat-room', component: ChatRoomComponent}]
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [{path: 'calendar', component: CalendarComponent}]
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [{path: 'settings', component: SettingsComponent}]
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  // Fallback when no prior routes is matched
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
