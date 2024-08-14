import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})

export class UserLoginFormComponent implements OnInit {

  @Input() userData = { username: '', password: '',};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
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

