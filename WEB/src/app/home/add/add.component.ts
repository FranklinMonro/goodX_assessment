import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddDialog,
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    ) {
      this.relationshipOptions = this.homeService.getRelaitionshipOptions();
      this.mainOptions = this.homeService.getMainOptions();
    }

  ngOnInit(): void {
    this.createDebtorForm();
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
      relaitionship: patRel = '',
    } = patient;
    return this.formBuilder.group({
      id: [patID],
      name: [patName],
      main: [patMain],
      relationship: [patRel],
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

  compareFn(op1: any, op2: any) {
    console.log('compareFn', op1, op2)
    return op1.name === op2.name;
  }

  public removePatient = (patientIndex: number): void => {
    console.log('removePatient, index', patientIndex);
    this.patientsControl.removeAt(patientIndex);
    this.dataSource = new MatTableDataSource(this.patientsControl.value);
  }

  public onSubmit = (): void => {
    if (this.debtorForm?.invalid) {
      this.toastrService.warning('Check form', 'WARNING');
      return;
    }
    this.loadSpinner = true;
    this.homeService.postNewDebtor(this.debtorForm?.value).subscribe({
      next: (response: HttpResponse<AddDialogDebtor>) => {
        this.loadSpinner = false;
        if (response.status === 200) {
          this.toastrService.success('Log In', 'SUCCESS');
          return;
        }
        this.toastrService.warning('Something went wrong in log in', 'WARNING');
      },
      error: (error: ErrorEvent) => {
        this.loadSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Log in details is incorrect', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in login, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadSpinner = false;
      }
    })

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
