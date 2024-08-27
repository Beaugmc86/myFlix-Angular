// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * The UserRegistrationFormComponent is used for user registration.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  /**
  * Holds the user's registration data.
  */
  @Input() userData = { username: '', password: '', email: '', birthDate: '' };

  /**
   * Creates an instance of UserRegistrationFormComponent.
   * @param fetchApiData - Service to interact with the API.
   * @param dialogRef - Reference to the dialog opened.
   * @param snackBar - Service to show snack bar notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
  }

  /**
   * Registers a new user by sending userData to the backend.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (response) => {
        // Success handling
        this.dialogRef.close(); // This will close the modal on success
        this.snackBar.open('Registration successful!', 'OK', {
          duration: 2000
        });
      },
      (error) => {
        // Error handling
        this.snackBar.open(`Registration failed: ${error.message || 'Please try again later.'}`, 'OK', {
          duration: 2000
        });
      }
    );
  }
}
