import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis-card',
  templateUrl: './synopsis-card.component.html',
  styleUrl: './synopsis-card.component.scss'
})
export class SynopsisCardComponent implements OnInit{

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: String;
      Description: String;
    },
    public dialogRef: MatDialogRef<SynopsisCardComponent>
  ) { }

  ngOnInit(): void { }

  closeDetail(): void {
    this.dialogRef.close();
  }
}
