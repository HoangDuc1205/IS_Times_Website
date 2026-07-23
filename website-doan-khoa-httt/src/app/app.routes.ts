import { Routes } from '@angular/router';
import { HeroComponent } from './hero/hero';
import { RegisterComponent } from './register/register';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' }
];
