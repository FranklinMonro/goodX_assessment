import { Routes } from '@angular/router';

export const viewPortRoutes: Routes =[
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { 
    path: 'calendar', 
    loadComponent: () => import('../calendar/calendar.component').then(m => m.CalendarComponent), 
  },
  {
    path: 'users',
    loadComponent: () => import('../users/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'bookings',
    loadComponent: () => import('../bookings/bookings.component').then(m => m.BookingsComponent),
  }
];