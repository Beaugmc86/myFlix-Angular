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
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  @Input() userData = { username: '', password: '', email: '', birthDate: ''};

  formUserData: any = {
    username: '',
    password: '',
    email: '',
    birthDate: '',
    FavoriteMovie: []
  };

  /** User object. */
  user: any = {};

  /** List of all movies. */
  movies: any[] = [];
 
  /** List of favorite movies. */
  favoriteMovie: any[] = [];
 
  /** List of favorite movie IDs. */
  favoriteMoviesIDs: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackbar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserProfile();
    this.getMovies();
    this.getFavoriteMovies();
  }

  // Fetch user data
  getUserProfile(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.formUserData = { ...this.user };
      this.favoriteMoviesIDs = this.user.favoriteMovie || [];
      
      this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
        this.favoriteMovie = movies.filter((movie: any) => this.favoriteMoviesIDs.includes(movie._id));
      });
    }
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result: any) => {
      if (Array.isArray(result)) {
        this.movies = result;
      }
      return this.movies;
    });
  }

  getFavoriteMovies(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(user.username).subscribe((result) => {
      this.favoriteMoviesIDs = result.favoriteMovie || [];
      this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
        this.favoriteMovie = movies.filter((movie: any) => 
          this.favoriteMoviesIDs.includes(movie._id));
      });
    });
  }

  // Check if a movie is in the user's list of favorites
  isFavorite(movie: any): boolean {
    return this.favoriteMoviesIDs.includes(movie._id);
  }

  toggleFavorite(movie: any): void {
    const isFavorite = this.isFavorite(movie);
    isFavorite
      ? this.deleteFavoriteMovies(movie)
      : this.addFavoriteMovies(movie);
  }

  addFavoriteMovies(movie: any): void {
    this.fetchApiData.addFavoriteMovie(this.user.username, movie._id).subscribe((response) => {
      localStorage.setItem('user', JSON.stringify(response));
      this.getFavoriteMovies(); // Refresh favorite movies after adding a new one
      this.snackbar.open('Added to your favorites', 'OK', { duration: 1000 });
    });
  }

  deleteFavoriteMovies(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.user.username, movie._id).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.favoriteMoviesIDs = this.favoriteMoviesIDs.filter((id) => id !== movie._id);
      this.getFavoriteMovies();
      this.snackbar.open('Removed from your favorites', 'OK', { duration: 1000 });
    });
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.formUserData.username, this.formUserData).subscribe((response) => {
      localStorage.setItem('user', JSON.stringify(response));
      this.snackbar.open('User updated successfully!', 'OK', { duration: 2000 });
      this.getUserProfile();
    }, (error) => {
      this.snackbar.open('Failed to update user', 'OK', { duration: 2000 });
    });
  }

  async deleteUser(): Promise<void> {
    if (confirm('Do you want to delete your account permanently?')) {
      this.fetchApiData.deleteUser(this.user.username).subscribe(() => {
        this.snackbar.open('Account deleted successfully!', 'OK', { duration: 3000 });
        localStorage.clear();
        this.router.navigate(['welcome']);
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
