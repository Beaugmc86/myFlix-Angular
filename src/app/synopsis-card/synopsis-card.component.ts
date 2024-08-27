import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying movie synopsis in a dialog.
 */
@Component({
  selector: 'app-synopsis-card',
  templateUrl: './synopsis-card.component.html',
  styleUrl: './synopsis-card.component.scss'
})
export class SynopsisCardComponent implements OnInit{

  /**
  * Constructor for MovieSynopsisComponent.
  * @param dialogRef - Reference to the dialog opened by the component.
  * @param data - Data passed to the dialog, including movie title and description.
  */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: String;
      Description: String;
    },
    public dialogRef: MatDialogRef<SynopsisCardComponent>
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
