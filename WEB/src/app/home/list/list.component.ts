import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../add/add.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  loadingSpinner: boolean = false;

  constructor(public dialog: MatDialog) {}

  public openAddClientDialog = (): void => {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '50%',
      height: '70%'
    })
  }
}
