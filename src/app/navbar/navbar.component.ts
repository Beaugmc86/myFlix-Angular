import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';

/**
 * Component for navigation management.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {

  /**
   * Creates an instance of NavbarComponent.
   * @param fetchApiData - Service for fetching data from the API
   * @param snackBar - Angular Material snackbar service.
   * @param router - Angular Router service.
   */
  constructor (
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOniInit(): void { }

  /**
   * Navigate to movies page.
   */
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Navigate to user profile page.
   */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logout user and navigate to welcome landing page.
   */
  public logoutUser(): void {
    localStorage.clear();
    this.snackBar.open('You have successfully logged out', 'OK', {
      duration: 2000
    });
    this.router.navigate(['welcome']);
  }

}
