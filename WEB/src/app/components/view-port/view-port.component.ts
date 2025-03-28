import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

import { LogInAuthUser } from '../auth/auth.models';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-view-port',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule
  ],
  templateUrl: './view-port.component.html',
  styleUrl: './view-port.component.scss',
  standalone: true,
})
export class ViewPortComponent {
  isExpanded: boolean = true;
  
  isShowing: boolean = false;
  
  userData: LogInAuthUser = JSON.parse(localStorage.getItem('authData')!);
  username: String | undefined;
  private readonly authService = inject(AuthService);

  navItems = [
    { toolTip: 'Calendar', link: 'calendar', icon: 'calendar_month', navName: 'Calendar' },
    { toolTip: 'Users', link: 'users', icon: 'group', navName: 'Users' },
    { toolTip: 'Booking', link: 'bookings', icon: 'book_online', navName: 'Booking' },
  ];
  
  logOut() {
    console.log('Logging out');
    this.authService.postLogOut();
  }
}
