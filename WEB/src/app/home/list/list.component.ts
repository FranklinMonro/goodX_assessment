import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../add/add.component';
import { HomeService } from '../home.service';
import { Subscription } from 'rxjs';
import { AddDialogDebtor } from '../add/add.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  loadSpinner: boolean = false;

  subscription: Subscription | undefined;
  
  displayedColumns: string[] = ['name', 'main', 'edit', 'remove'];

  dataSource: MatTableDataSource<AddDialogDebtor[]> = new MatTableDataSource<AddDialogDebtor[]>([]);
  constructor(
    public dialog: MatDialog,
    private homeService: HomeService,
    private toastrService: ToastrService,
  ) {}


  ngOnInit(): void {
    this.getDebtorsList();
  };


  private getDebtorsList = () => {
    this.loadSpinner = true;
    this.subscription = this.homeService.getDebtorAll().subscribe({
      next: (response: any) => {
        this.loadSpinner = false;
        if (response.status === 200) {
          this.toastrService.success('Client list retrieved', 'SUCCESS');
          this.dataSource = new MatTableDataSource(response.body);
          return;
        }
        this.toastrService.warning('Client list has not been retrieved', 'WARNING');
      },
      error: (error: ErrorEvent) => {
        this.loadSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Client list has not been retrieved', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in retrieving client list, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.loadSpinner = false;
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
    this.loadSpinner = true;
    this.subscription = this.homeService.deleteClient(debtorID).subscribe({
      next: (response: any) => {
        this.loadSpinner = false;
        if (response.status === 202) {
          this.toastrService.success('Client has been deleted', 'SUCCESS');
          this.getDebtorsList();
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
