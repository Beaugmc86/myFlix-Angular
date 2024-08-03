import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-card',
  templateUrl: './director-card.component.html',
  styleUrl: './director-card.component.scss'
})
export class DirectorCardComponent implements OnInit{

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Bio: string;
      Birth: Date;
    },
    public dialogRef: MatDialogRef<DirectorCardComponent>
  ) { }

  ngOnInit(): void { }

  closeDetail(): void {
    this.dialogRef.close();
  }
}
