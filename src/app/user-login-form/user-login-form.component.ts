import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

/**
 * Component for user login management.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})

export class UserLoginFormComponent implements OnInit {
  /** Input user data to login. */
  @Input() userData = { username: '', password: '',};

  /**
   * Constructs the UserProfileComponent.
   * @param fetchApiData - The service for fetching API data.
   * @param dialogRef - The dialog service for displaying dialogs.
   * @param snackBar - The snack bar service for displaying notifications.
   * @param router - The router service for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
  }

  /**
   * Logs in the user.
   * If successful, saves user data and token in local storage, closes the dialog,
   * shows a success notification, and navigates to the movies page.
   * If login fails, shows a failure notification.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (response) => {
        console.log(response);
        this.dialogRef.close();
        this.snackBar.open('User Login successful', 'OK', {
          duration: 2000,
        });
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.router.navigate(['movies']);
      },
      (response) => {
        this.snackBar.open('User login failed', 'OK', {
          duration: 2000
        });
      });
    }
}

