import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying director details in a dialog.
 */
@Component({
  selector: 'app-director-card',
  templateUrl: './director-card.component.html',
  styleUrl: './director-card.component.scss'
})
export class DirectorCardComponent implements OnInit{

  /**
  * Constructor for MovieSynopsisComponent.
  * @param dialogRef - Reference to the dialog opened by the component.
  * @param data - Data passed to the dialog, including movie title and description.
  */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Bio: string;
      Birth: Date;
    },
    public dialogRef: MatDialogRef<DirectorCardComponent>
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
