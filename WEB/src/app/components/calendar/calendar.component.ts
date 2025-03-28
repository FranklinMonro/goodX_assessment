import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DxSelectBoxModule } from 'devextreme-angular';
import { DxSchedulerModule } from 'devextreme-angular'; 

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Appointment } from './calendar.models';
import { BookingClient, Patient } from '../users/users.model';

import { BookingsService, Doctor } from '../bookings/bookings.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  imports: [
    MatProgressSpinnerModule,
    DxSelectBoxModule,
    DxSchedulerModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  standalone: true,
})
export class CalendarComponent implements OnInit, OnDestroy {
  loadingSpinner: boolean = false;

  subscription: Subscription | undefined;
  
  appointmentsSource: Appointment[] | undefined;

  currentDate: Date = new Date();

  doctorOptions: Doctor[] | undefined;

  debtorSource: BookingClient[] | undefined;

  mainSource: Patient[] | undefined;

  mainPatient: string | undefined;

  patientSource: any[] | undefined;

  private readonly bookingsService = inject(BookingsService);
  private readonly toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.getAllClient();
    this.getAllBookings();
  }

  private getAllClient = (): void => {
    this.loadingSpinner = true;
      this.subscription = this.bookingsService.getBookingClients().subscribe({
        next: (response: HttpResponse<BookingClient[]>) => {
          this.loadingSpinner = false;
          this.debtorSource = response.body!;
          this.mainSource = this.debtorSource.map((debt) => debt.mainClient as Patient);
          this.patientSource = this.debtorSource.map((debt) => debt.patientClients?.map((pat) => pat)[0]);
        },
        error: (error: ErrorEvent) => {
          this.loadingSpinner = false;
          if (error.message.includes('404')) {
            this.toastrService.warning('Client has not been deleted', 'WARNING');
            return;
          }
          this.toastrService.error(`Error deleting client, error: ${error.message}`, 'ERROR')
        },
        complete: () => {
          this.loadingSpinner = false;
        }
      });
  };

  private getAllBookings = (): void => {
    this.loadingSpinner = true;
    this.subscription = this.bookingsService.getBookings().subscribe({
      next: (response: Appointment[]) => {
        this.appointmentsSource = response;
        this.loadingSpinner = false;
      },
      error: (error: ErrorEvent) => {
        this.loadingSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Appointment has not been added', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in adding appointment, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadingSpinner = false;
      }
    });
  }

  public onAppointmentAdding = (event: any) => {
    this.loadingSpinner = true;
    this.subscription = this.bookingsService.postBooking(event.appointmentData).subscribe({
      next: (response: Appointment) => {
        if (response) {
          this.toastrService.success('Appointment has been added', 'SUCCESS');
        }
        this.loadingSpinner = false;
      },
      error: (error: ErrorEvent) => {
        this.loadingSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Appointment has not been added', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in adding appointment, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadingSpinner = false;
      }
    });
  }

  public editAppointment = (event: any) => {
    this.loadingSpinner = true;
    this.subscription = this.bookingsService.putBookings(event.appointmentData).subscribe({
      next: (response: Appointment) => {
        if (response) {
          this.toastrService.success('Appointment has been updated', 'SUCCESS');
        }
        this.loadingSpinner = false;
      },
      error: (error: ErrorEvent) => {
        this.loadingSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Appointment has not been updated', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in updating appointment, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadingSpinner = false;
      }
    });
  }

  public deleteAppointment = (event: any) => {
    console.log('deleteAppointment', event);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
