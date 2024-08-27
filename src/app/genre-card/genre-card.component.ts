import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying genre details in a dialog.
 */
@Component({
  selector: 'app-genre-card',
  templateUrl: './genre-card.component.html',
  styleUrl: './genre-card.component.scss'
})
export class GenreCardComponent implements OnInit {

  /**
  * Constructor for MovieSynopsisComponent.
  * @param dialogRef - Reference to the dialog opened by the component.
  * @param data - Data passed to the dialog, including movie title and description.
  */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Genre: string;
      Description: string;
    },
    public dialogRef: MatDialogRef<GenreCardComponent>
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void { }

  /**
   * Closes the dialog.
   */
  closeDetail(): void {
    this.dialogRef.close();
  }
}
