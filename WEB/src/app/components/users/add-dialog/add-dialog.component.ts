import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { AddDialog, AddDialogDebtor, AddDialogDebtorPatients } from '../users.model';
import { UsersService } from '../users.service';
import { HttpResponse } from '@angular/common/http';

export interface DataType {
  value: string | number | boolean,
  name: string,
}

@Component({
  selector: 'app-add',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss',
  standalone: true,
})
export class AddComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  
  loadSpinner: boolean = false;

  relationshipOptions: DataType[] | undefined;

  mainOptions: DataType[] | undefined;

  debtorForm: FormGroup | undefined;

  subscription: Subscription | undefined;

  displayedColumns: string[] = ['name', 'main', 'relationship', 'remove'];

  dataSource: MatTableDataSource<AddDialogDebtorPatients[]> = new MatTableDataSource<AddDialogDebtorPatients[]>([]);

  dialogType: string = 'ADD';

  private readonly data: AddDialog = inject(MAT_DIALOG_DATA);
  private readonly usersService: UsersService = inject(UsersService);
  private readonly toastrService: ToastrService = inject(ToastrService);
  private readonly dialogRef: MatDialogRef<AddComponent> = inject(MatDialogRef<AddComponent>);
  constructor() {
    this.relationshipOptions = this.usersService.getRelaitionshipOptions();
    this.mainOptions = this.usersService.getMainOptions();
    this.dialogType = this.data.clientID !== '' && this.data.clientID !== null ? 'EDIT': 'ADD';
  }
  ngOnInit(): void {
    this.createDebtorForm();
    if (this.data.clientID !== '' && this.data.clientID !== null) {
      this.getClient(this.data.clientID!);
    }
  };

  private getClient = (clientID: string): void => {
    this.loadSpinner = true;
      this.subscription = this.usersService.getClient(clientID).subscribe({
        next: (response: HttpResponse<AddDialogDebtor>) => {
          const responseBody = response.body;
          if (responseBody) {
            this.debtorForm?.patchValue({id: responseBody.id, debtor: responseBody.debtor, telephone: responseBody.telephone});
            responseBody.patients?.forEach((pat) => {
              this.patientsControl.push(this.createPatientForm(pat));
            });
            this.dataSource = new MatTableDataSource(this.patientsControl.value);
          } else {
            this.toastrService.warning('Client not found', 'WARNING');
          }
          this.loadSpinner = false;
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

  private createDebtorForm = (): void => {
    this.debtorForm = new FormGroup({
      id: new FormControl(null),
      debtor: new FormControl(null, [Validators.required]),
      telephone: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      patients: new FormArray([]),
    });
  };

  private createPatientForm = (patient: AddDialogDebtorPatients) => {
    const {
      id: patID = '',
      name: patName = '',
      main: patMain = false,
      relationship: patRel = '',
    } = patient;
    return new FormGroup({
      id: new FormControl(patID),
      name: new FormControl(patName, [Validators.required]),
      main: new FormControl(patMain, [Validators.required]),
      relationship: new FormControl(patRel, [Validators.required]),
    });
  };

  get patientsControl(): FormArray {
    return this.debtorForm?.get('patients') as FormArray;
  }

  public addPatient = (): void => {
    if (this.patientsControl.controls.length === 0) {
      this.patientsControl.push(this.createPatientForm({
        name: this.debtorForm?.get('debtor')?.value,
        main: true,
      }));
      
    } else {
      this.patientsControl.push(this.createPatientForm({}));
    }
    this.dataSource = new MatTableDataSource(this.patientsControl.value);
  }

  public applyFilter = (event: Event): void => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  };

  public checkIfDebtor = (rowIndex: number, formControl: string): boolean => {
    const debtorName = this.debtorForm?.get('debtor')?.value;
    const patientName = this.patientsControl.at(rowIndex).get('name')?.value;
    if (debtorName === patientName) {
      this.patientsControl.at(rowIndex).get(formControl)?.disable();
      return true
    }

    this.patientsControl.at(rowIndex).get(formControl)?.enable();
    return false;
  };

  compareFn(op1: AddDialogDebtorPatients, op2: AddDialogDebtorPatients) {
    return op1.relationship !== op2.relationship;
  }

  public removePatient = (patientIndex: number): void => {
    this.patientsControl.removeAt(patientIndex);
    this.dataSource = new MatTableDataSource(this.patientsControl.value);

    const patientID = this.patientsControl.at(patientIndex).get('id')?.value;
    if (patientID !== '' || patientID !== null) {
      this.loadSpinner = true;
      this.subscription = this.usersService.deleteClient(patientID).subscribe({
        next: (response: any) => {
          this.loadSpinner = false;
          if (response.status === 202) {
            this.toastrService.success('Client has been deleted', 'SUCCESS');
            this.dataSource = new MatTableDataSource(response.body);
            return;
          }
          this.toastrService.warning('Client has not been deleted', 'WARNING');
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
  };

  public submitClient = (): void => {
    if (this.debtorForm?.invalid) {
      this.toastrService.warning('Check form', 'WARNING');
      return;
    }
    
    if (this.dialogType === 'ADD') {
      this.postNewClient();
    } else {
      this.putEditClient();
    }
  }

  private postNewClient = (): void => {
    this.loadSpinner = true;
    this.subscription = this.usersService.postNewDebtor(this.debtorForm?.value).subscribe({
      next: (response: HttpResponse<AddDialogDebtor>) => {
        this.loadSpinner = false;
        if (response.status === 201) {
          this.toastrService.success('Client has been added', 'SUCCESS');
          this.dialogRef.close(true);
          return;
        }
        this.toastrService.warning('Client has not been added', 'WARNING');
      },
      error: (error: ErrorEvent) => {
        this.loadSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Client has not been added', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in adding client, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadSpinner = false;
      }
    });
  }

  private putEditClient = (): void => {
    this.loadSpinner = true;
    this.subscription = this.usersService.putClient(this.debtorForm?.value).subscribe({
      next: (response: HttpResponse<AddDialogDebtor>) => {
        this.loadSpinner = false;
        if (response.status === 201) {
          this.toastrService.success('Client has been updated', 'SUCCESS');
          this.dialogRef.close(true);
          return;
        }
        this.toastrService.warning('Client has not been updated', 'WARNING');
      },
      error: (error: ErrorEvent) => {
        this.loadSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Client has not been updated', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in updating client, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadSpinner = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
