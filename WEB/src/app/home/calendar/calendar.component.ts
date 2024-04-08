import { Component, OnDestroy, OnInit } from '@angular/core';

import { Appointment, BookingClient, Patient } from './calendar.interfaces';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HomeService, Doctor } from '../home.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})

export class CalendarComponent implements OnInit, OnDestroy {
  loadSpinner: boolean = false;
  subscription: Subscription | undefined;
  
  appointmentsSource: Appointment[] | undefined;

  currentDate: Date = new Date();

  doctorOptions: Doctor[] | undefined;

  debtorSource: BookingClient[] | undefined;

  mainSource: Patient[] | undefined;

  mainPatient: string | undefined;

  patientSource: any[] | undefined;

  constructor(
    private homeService: HomeService,
    private toastrService: ToastrService,
  ) {
    this.doctorOptions = this.homeService.getDoctors();
    this.getAllClient();
  }

  ngOnInit(): void {
    this.getAllClient();
    this.getAllBookings();
  }

  private getAllClient = (): void => {
    this.loadSpinner = true;
      this.subscription = this.homeService.getBookingClients().subscribe({
        next: (response: BookingClient[]) => {
          this.loadSpinner = false;
          this.debtorSource = response;
          this.mainSource = this.debtorSource.map((debt) => debt.mainClient as Patient);
          this.patientSource = this.debtorSource.map((debt) => debt.patientClients?.map((pat) => pat)[0]);
        },
        error: (error: ErrorEvent) => {
          this.loadSpinner = false;
          if (error.message.includes('404')) {
            this.toastrService.warning('Client has not been deleted', 'WARNING');
            return;
          }
          this.toastrService.error(`Error deleting client, error: ${error.message}`, 'ERROR')
        },
        complete: () => {
          this.loadSpinner = false;
        }
      });
  };

  private getAllBookings = (): void => {
    this.loadSpinner = true;
    this.subscription = this.homeService.getBookings().subscribe({
      next: (response: Appointment[]) => {
        this.appointmentsSource = response;
        this.loadSpinner = false;
      },
      error: (error: ErrorEvent) => {
        this.loadSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Appointment has not been added', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in adding appointment, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadSpinner = false;
      }
    });
  }

  public onAppointmentAdding = (event: any) => {
    this.loadSpinner = true;
    this.subscription = this.homeService.postBooking(event.appointmentData).subscribe({
      next: (response: Appointment) => {
        if (response) {
          this.toastrService.success('Appointment has been added', 'SUCCESS');
        }
        this.loadSpinner = false;
      },
      error: (error: ErrorEvent) => {
        this.loadSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Appointment has not been added', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in adding appointment, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadSpinner = false;
      }
    });
  }

  public editAppointment = (event: any) => {
    this.loadSpinner = true;
    this.subscription = this.homeService.putBookings(event.appointmentData).subscribe({
      next: (response: Appointment) => {
        if (response) {
          this.toastrService.success('Appointment has been updated', 'SUCCESS');
        }
        this.loadSpinner = false;
      },
      error: (error: ErrorEvent) => {
        this.loadSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Appointment has not been updated', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in updating appointment, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadSpinner = false;
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
