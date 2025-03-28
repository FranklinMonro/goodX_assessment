import { Routes } from '@angular/router';
import { authGuard } from './components/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent) },
  { 
    path: 'home', 
    loadComponent: () => import('./components/view-port/view-port.component').then(m => m.ViewPortComponent),
    loadChildren: () => import('./components/view-port/view-port.routes').then(m => m.viewPortRoutes),
    // canActivate: [authGuard],
   },
];
