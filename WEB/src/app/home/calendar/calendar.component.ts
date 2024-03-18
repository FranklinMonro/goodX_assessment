import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { Appointment, BookingClient, Patient } from './calendar.interfaces';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AddDialogDebtor } from '../add/add.interface';
import { DataType, HomeService, Doctor } from '../home.service';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy, OnChanges {
  loadSpinner: boolean = false;
  subscription: Subscription | undefined;
  
  appointments: Appointment[] | undefined;

  currentDate: Date = new Date();

  doctorOptions: Doctor[] | undefined;

  debtorSource: BookingClient[] | undefined;

  mainSource: Patient[] | undefined;

  mainPatient: string | undefined;

  patientSource: Patient[] | undefined;

  constructor(
    private homeService: HomeService,
    private toastrService: ToastrService,
  ) {
    this.doctorOptions = this.homeService.getDoctors();
    this.getAllClient();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  ngOnInit(): void {
    this.getAllClient();
  }

  private getAllClient = (): void => {
    this.loadSpinner = true;
      this.subscription = this.homeService.getBookingClients().subscribe({
        next: (response: BookingClient[]) => {
          this.loadSpinner = false;
          this.debtorSource = response;
          this.mainSource = this.debtorSource.map((debt) => debt.mainClient as Patient);
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

  public selectPatients = (data: DxSchedulerTypes.AppointmentFormOpeningEvent) => {
    console.log('select patients', data)
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
