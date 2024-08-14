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
  /** Input for user data. */
  @Input() userData: any = { username: '', password: '', email: '', birthDate: '' };

  /** Form data for user. */
  formUserData: any = {
    username: '',
    password: '',
    email: '',
    birthDate: '',
    favoriteMovie: []
  };

  /** User object. */
  user: any = {};

  /** List of all movies. */
  movies: any[] = [];

  /** List of favorite movies. */
  favoriteMovie: any[] = [];

  /** List of favorite movie IDs. */
  favoriteMoviesIDs: any[] = [];

  /**
     * Constructs the UserProfileComponent.
     * @param fetchApiData - The service for fetching API data.
     * @param dialog - The dialog service for displaying dialogs.
     * @param snackBar - The snack bar service for displaying notifications.
     * @param router - The router service for navigation.
     */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }
/** Lifecycle hook called after component initialization. */  ngOnInit(): void {
    this.getUserProfile();
    this.getMovies();
    this.getFavoriteMovie();
  }

  // Fetches user profile data.
  public getUserProfile(): void {
    const username = this.userData.username;
    if (username) {
      this.fetchApiData.getUser(username).subscribe((result: any) => {
        console.log('result:', result.favoritemovie);
        this.user = result;
        this.userData.username = this.user.username;
        this.userData.email = this.user.email;
        if (this.user.birthDate) {
          let birthday = new Date(this.user.birthDate);
          if (!isNaN(birthday.getTime())) {
            this.userData.birthDate = birthday.toISOString().split('T')[0];
          }
        }
        this.formUserData = { ...this.userData };
        this.favoriteMoviesIDs = this.user.favoritemovie;

        this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
          this.favoriteMovie = movies.filter((movie: any) => this.favoriteMoviesIDs.includes(movie._id));
        });
      });
    } else {
      console.error('Username is not available.');
    }
  }

  //Fetches all movies.
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result: any) => {
      if (Array.isArray(result)) {
        this.movies = result;
      }
      return this.movies;
    });
  }

  //Fetches user's favorite movies.
  getFavoriteMovie(): void {
    const username = this.userData.username;
    if (username) {
      this.fetchApiData.getUser(username).subscribe((result) => {
        this.favoriteMoviesIDs = result.favoritemovie;
      });
    } else {
      console.error('Username is not available.')
    }
  }

  // Checks if a movie is in the user's favorite movies list.
  isFavorite(movie: any): boolean {

    return this.favoriteMoviesIDs.includes(movie._id);
  }


  //Toggles a movie in the user's favorite movies list.
  toggleFavorite(movie: any): void {
    const isFavorite = this.isFavorite(movie);
    isFavorite
      ? this.deleteFavoriteMovie(movie)
      : this.addFavoriteMovie(movie);
  }

  //Adds a movie to the user's favorite movies list.
  addFavoriteMovie(movie: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      this.fetchApiData.addFavoriteMovie(user.userName, movie._id).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.getFavoriteMovie(); // Refresh favorite movies after adding a new one
        this.snackBar.open('Added Favorite', 'OK', {
          duration: 1000,
        });
      });
    }
  }

  //Deletes a movie from the user's favorite movies list.
  deleteFavoriteMovie(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.userData.UserId = parsedUser._id;
      this.fetchApiData.deleteFavoriteMovie(parsedUser.userName, movie._id).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        // Remove the movie ID from the favoritemovie array
        this.favoriteMoviesIDs = this.favoriteMoviesIDs.filter((id) => id !== movie._id);
        // Fetch the user's favorite movies again to update the movie list
        this.getFavoriteMovie();
        // Show a snack bar message
        this.snackBar.open('Removed Favorite', 'OK', {
          duration: 1000,
        });
      });
    }
  }

  //Updates user data.
  updateUser(): void {
    const username = this.userData.username;
    const updatedUserData = this.formUserData;
    if (username && updatedUserData) {
      this.fetchApiData.editUser(username, updatedUserData).subscribe((result) => {
        console.log('User update success:', result);
        localStorage.setItem('user', JSON.stringify(result));
        this.snackBar.open('User updated successfully!', 'OK', {
          duration: 2000,
        });
        this.getUserProfile();
      }, (error) => {
        console.log('Error updating user:', error);
        this.snackBar.open('Failed to update user', 'OK', {
          duration: 2000,
        });
      });
    } else {
      console.error('Username or updated user data is missing.');
      this.snackBar.open('Failed to update user. Missing username or data.', 'OK', {
        duration: 2000,
      });
    }
  }

  //Deletes the user's account.
  async deleteUser(): Promise<void> {
    const username = this.userData.username;
    console.log('deleteUser function called:', username);
    if (confirm('Do you want to delete your account permanently?')) {
      if (username) {
        this.fetchApiData.deleteUser(username).subscribe(() => {
          this.snackBar.open('Account deleted successfully!', 'OK', {
            duration: 3000,
          });
          localStorage.clear();
          this.router.navigate(['welcome']);
        }, (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Failed to delete account', 'OK', {
            duration: 3000,
          });
        });
      } else {
        console.error('Username is not available.');
        this.snackBar.open('Failed to delete account. Username is missing.', 'OK', {
          duration: 3000,
        });
      }
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
