import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AddDialog, AddDialogDebtor, AddDialogDebtorPatients } from './add.interface';
import { DataType, HomeService } from '../home.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit, OnDestroy {
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddDialog,
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    ) {
      this.relationshipOptions = this.homeService.getRelaitionshipOptions();
      this.mainOptions = this.homeService.getMainOptions();
      this.dialogType = this.data.clientID !== '' || this.data.clientID !== null ? 'EDIT': 'ADD';
    }

  ngOnInit(): void {
    this.createDebtorForm();
    if (this.data.clientID !== '' || this.data.clientID !== null) {
      this.getClient(this.data.clientID!);
    }
  };

  private getClient = (clientID: string): void => {
    this.loadSpinner = true;
      this.subscription = this.homeService.getClient(clientID).subscribe({
        next: (response: AddDialogDebtor) => {
          this.loadSpinner = false;
          this.debtorForm?.patchValue({id: response.id, debtor: response.debtor, telephone: response.telephone});
          response.patients?.forEach((pat) => {
            this.patientsControl.push(this.createPatientForm(pat));
          });
          this.dataSource = new MatTableDataSource(this.patientsControl.value);
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
    this.debtorForm = this.formBuilder.group({
      id: [null],
      debtor: [null, [Validators.required]],
      telephone: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      patients: this.formBuilder.array([]),
    })
  };

  private createPatientForm = (patient: AddDialogDebtorPatients) => {
    const {
      id: patID = '',
      name: patName = '',
      main: patMain = false,
      relationship: patRel = '',
    } = patient;
    return this.formBuilder.group({
      id: [patID],
      name: [patName, [Validators.required]],
      main: [patMain, [Validators.required]],
      relationship: [patRel, [Validators.required]],
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
    console.log('op1', op1, 'op2', op2)
    return op1.relationship !== op2.relationship;
  }

  public removePatient = (patientIndex: number): void => {
    this.patientsControl.removeAt(patientIndex);
    this.dataSource = new MatTableDataSource(this.patientsControl.value);

    const patientID = this.patientsControl.at(patientIndex).get('id')?.value;
    if (patientID !== '' || patientID !== null) {
      this.loadSpinner = true;
      this.subscription = this.homeService.deleteClient(patientID).subscribe({
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

  public addClient = (): void => {
    if (this.debtorForm?.invalid) {
      this.toastrService.warning('Check form', 'WARNING');
      return;
    }
    this.loadSpinner = true;
    this.subscription = this.homeService.postNewDebtor(this.debtorForm?.value).subscribe({
      next: (response: HttpResponse<AddDialogDebtor>) => {
        this.loadSpinner = false;
        if (response.status === 201) {
          this.toastrService.success('Client has been added', 'SUCCESS');
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
