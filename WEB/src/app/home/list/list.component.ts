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
import { HttpResponse } from '@angular/common/http';

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
  
  displayedColumns: string[] = ['name', 'main', 'remove'];

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
      next: (response: HttpResponse<AddDialogDebtor>) => {
        this.loadSpinner = false;
        if (response.status === 200) {
          this.toastrService.success('Client has been added', 'SUCCESS');
          console.log(response.body);
          return;
        }
        this.toastrService.warning('Client has not been added', 'WARNING');
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
  };

  public openAddClientDialog = (): void => {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '50%',
      height: '70%'
    })
  };

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };
}
