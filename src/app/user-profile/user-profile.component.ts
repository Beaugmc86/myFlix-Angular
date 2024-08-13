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

  @Input() userData = { username: '', password: '', email: '', birthDate: '', favoriteMovies: [] };
  favoriteMovies: any[] = [];
  allMovies: any[] = [];
  user: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUser();
  }

  // Fetch user data
  getUser(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe((resp: any) => {
        this.user = resp;
        this.favoriteMovies = this.user.FavoriteMovies || []; // Update favoriteMovies from user data
        this.getAllMovies(); // Fetch all movies after getting user data
      });
    }
  }

  // Update user data
  updateUser(): void {
    const username = localStorage.getItem('username');
    if (username) {
      const userData = {
        username: this.userData.username,
        password: this.userData.password,
        email: this.userData.email,
        birthDate: this.userData.birthDate,
      };

      this.fetchApiData.editUser(username, userData).subscribe(
        (resp: any) => {
          this.snackBar.open('User profile updated successfully', 'OK', {
            duration: 2000,
          });
          localStorage.setItem('username', resp.username); // Update local storage if username changes
        },
        error => {
          this.snackBar.open('Error updating user profile', 'OK', {
            duration: 2000,
          });
        }
      );
    } else {
      this.snackBar.open('Username not found in local storage', 'OK', {
        duration: 2000,
      });
    }
  }

  // Fetch all movies and filter favorite movies
  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: any) => {
      this.allMovies = movies;
      this.filterFavoriteMovies();
    });
  }

  // Filter favorite movies
  filterFavoriteMovies(): void {
    if (this.user.FavoriteMovies) {
      this.favoriteMovies = this.allMovies.filter((movie: any) =>
        this.user.FavoriteMovies.includes(movie._id)
      );
    }
  }

  // Remove movie from favorite
  removeFavoriteMovie(movieId: string): void {
    const username = localStorage.getItem('username');

    if (username) {
      this.fetchApiData.deleteFavoriteMovie(username, movieId).subscribe(() => {
        this.snackBar.open('Movie removed from favorites', 'OK', {
          duration: 2000,
        });
        this.getUser(); // Refresh favorite movies
      });
    } else {
      this.snackBar.open('Error: Username not found', 'OK', {
        duration: 2000,
      });
    }
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

  // Router back to movie page
  backToMovie(): void {
    this.router.navigate(['movies']);
  }
}
