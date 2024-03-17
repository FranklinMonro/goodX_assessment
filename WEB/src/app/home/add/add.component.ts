import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AddDialog, AddDialogDebtorPatients } from './add.interface';
import { DataType, HomeService } from '../home.service';
import { ToastrService } from 'ngx-toastr';

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

  private createPatientForm = (patient: AddDialogDebtorPatients ) => {
    return this.formBuilder.group({
      id: [patient.id! || null],
      name: [patient.name! || null],
      main: [patient.main! || null],
      relationship: [patient.relaitionship! || null],
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
      this.patientsControl.push([]);
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

  compareFn(op1: any, op2: any) {
    console.log('compareFn', op1, op2);
    return op1.name === op2.name;
  }

  public removePatient = (patientIndex: number): void => {
    console.log('removePatient, index', patientIndex);
  }

  public onSubmit = (): void => {

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
