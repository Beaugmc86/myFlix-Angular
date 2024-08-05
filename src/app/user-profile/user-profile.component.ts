import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DirectorCardComponent } from '../director-card/director-card.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { SynopsisCardComponent } from '../synopsis-card/synopsis-card.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent implements OnInit {

  @Input()
  userData = { username: '', password: '', email: '', birthDate: '' };
  favoriteMovies: any[] = [];
  allMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUser();
    this.getFavoriteMovies();
  }

  // Fetch user data
  getUser(): void {
    const username = localStorage.getItem('username');
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.userData = resp;
    });
  }

  // Update user data
  updateUser(): void {
    const username = localStorage.getItem('username');
    this.fetchApiData.editUser().subscribe((resp: any) => {
      this.snackBar.open('User profile updated successfully', 'OK', {
        duration: 2000,
      });
      localStorage.setItem('username', resp.username); // Update local storage if username changes
    });
  }

  // Fetch all movies and filter favorite movies
  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: any) => {
      this.allMovies = movies;
      this.filterFavoriteMovies();
    });
  }

  // Filter favorite movies
  filterFavoriteMovies(): void {
    const username = localStorage.getItem('username');
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.favoriteMovies = this.allMovies.filter((movie: any) =>
        resp.FavoriteMovies.includes(movie._id)
      );
    });
  }

  // Remove movie from favorite
  removeFavoriteMovie(movieId: string): void {
    const username = localStorage.getItem('username');
    this.fetchApiData.deleteFavoriteMovie().subscribe((resp: any) => {
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000,
      });
      this.getFavoriteMovies(); // Refresh favorite movies
    });
  }

  // Open genre dialog
  openGenreDialog(movie: any): void {
    this.dialog.open(GenreCardComponent, {
      data: {
        Genre: String(movie.Genre.Name),
        Description: movie.Genre.Description,
      },
      width: '500px',
    });
  }

  // Open director dialog
  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorCardComponent, {
      data: {
        Name: String(movie.Director.Name),
        Bio: String(movie.Director.Bio),
        Birth: String(movie.Director.Birth),
      },
      width: '500px',
    });
  }

  // Open synopsis dialog
  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisCardComponent, {
      data: {
        Name: String(movie.Title),
        Description: String(movie.Description),
      },
      width: '500px',
    });
  }

}
