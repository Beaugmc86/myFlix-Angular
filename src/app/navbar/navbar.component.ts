import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {

  ngOnInit(): void {
    
  }

  constructor (
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  public logoutUser(): void {
    localStorage.clear();
    this.snackBar.open('You have successfully logged out', 'OK', {
      duration: 2000
    });
    this.router.navigate(['welcome']);
  }

}
