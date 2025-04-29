import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ClientdashComponent } from './client/clientdash/clientdash.component';
import { AdmindashComponent } from './admin/admindash/admindash.component';
import { CreateEventComponent } from './admin/create-event/create-event.component';
import { EventListComponent } from './core/event-list/event-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdmindashComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'creer-event',
    component: CreateEventComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path:'events',
    component: EventListComponent,
  },
  {
    path: 'client',
    component: ClientdashComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'client' }
  },
  { path: '**', redirectTo: '' }
];
