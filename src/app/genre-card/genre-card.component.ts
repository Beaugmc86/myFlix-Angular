import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-card',
  templateUrl: './genre-card.component.html',
  styleUrl: './genre-card.component.scss'
})
export class GenreCardComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Genre: string;
      Description: string;
    },
    public dialogRef: MatDialogRef<GenreCardComponent>
  ) { }

  ngOnInit(): void { }

  closeDetail(): void{
    this.dialogRef.close();
  }
}
