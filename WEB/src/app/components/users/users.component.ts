import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { AddComponent } from './add-dialog/add-dialog.component';
import { AddDialogDebtor } from './users.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  standalone: true,
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  
  loadingSpinner: boolean = false;

  subscription: Subscription | undefined;
  
  displayedColumns: string[] = ['name', 'main', 'edit', 'remove'];

  dataSource: MatTableDataSource<AddDialogDebtor[]> = new MatTableDataSource<AddDialogDebtor[]>([])
  
  private readonly usersService: UsersService = inject(UsersService);
  private readonly toastrService: ToastrService = inject(ToastrService);

  constructor(public readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDebtorsList();
  };


  private getDebtorsList = () => {
    this.loadingSpinner = true;
    this.subscription = this.usersService.getDebtorAll().subscribe({
      next: (response: any) => {
        this.loadingSpinner = false;
        if (response.status === 200) {
          this.toastrService.success('Client list retrieved', 'SUCCESS');
          this.dataSource = new MatTableDataSource(response.body);
          return;
        }
        this.toastrService.warning('Client list has not been retrieved', 'WARNING');
      },
      error: (error: ErrorEvent) => {
        this.loadingSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Client list has not been retrieved', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in retrieving client list, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadingSpinner = false;
      }
    })
  };

  public applyFilter = (event: Event): void => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  };

  public removeDebtor = (debtorID: string): void => {
    this.loadingSpinner = true;
    this.subscription = this.usersService.deleteClient(debtorID).subscribe({
      next: (response: any) => {
        this.loadingSpinner = false;
        if (response.status === 202) {
          this.toastrService.success('Client has been deleted', 'SUCCESS');
          this.getDebtorsList();
          return;
        }
        this.toastrService.warning('Client has not been deleted', 'WARNING');
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

  public openAddClientDialog = (clientID: string | null): void => {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {
        clientID,
      },
      width: '90%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.getDebtorsList();
      }
    })
  };

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };
}
