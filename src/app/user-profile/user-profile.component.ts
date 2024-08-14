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
    this.fetchApiData.getUser(this.user).subscribe((result: any) => {
      console.log('result:', result.favoritemovie);
      this.user = result;
      this.userData.username = this.user.username;
      this.userData.email = this.user.email;
      if (this.user.birthDate) {
        let birthDate = new Date(this.user.birthDate);
        if (!isNaN(birthDate.getTime())) {
          this.userData.birthDate = birthDate.toISOString().split('T')[0];
        }
      }
      this.formUserData = { ...this.userData };
      this.favoriteMoviesIDs = this.user.favoritemovie;

      this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
        this.favoriteMovie = movies.filter((movie: any) => this.favoriteMoviesIDs.includes(movie._id));
      });
    });
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
    this.fetchApiData.getUser(this.user).subscribe((result) => {
      this.favoriteMoviesIDs = result.favoritemovie;
    });
  }

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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      this.fetchApiData.addFavoriteMovie(user.username, movie._id).subscribe((response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.getFavoriteMovies(); // Refresh favorite movies after adding a new one
        this.snackbar.open('Added to your favorites', 'OK', {
          duration: 1000,
        });
      });
    }
  }

  deleteFavoriteMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData.deleteFavoriteMovie(parsedUser.userName, movie._id).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        // Remove the movie ID from the favoritemovie array
        this.favoriteMoviesIDs = this.favoriteMoviesIDs.filter((id) => id !== movie._id);
        // Fetch the user's favorite movies again to update the movie list
        this.getFavoriteMovies();
        // Show a snack bar message
        this.snackbar.open('Removed from your favorites', 'OK', {
          duration: 1000,
        });
      });
    }
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.formUserData, this.user).subscribe((response) => {
      console.log('User update success:', response);
      localStorage.setItem('user', JSON.stringify(response));
      this.snackbar.open('User updated successfully!', 'OK', {
        duration: 2000,
      });
      this.getUserProfile();
    }, (error) => {
      console.log('Error updating user:', error);
      this.snackbar.open('Failed to update user', 'OK', {
        duration: 2000,
      });
    });
  }

  async deleteUser(): Promise<void> {
    console.log('deleteUser function called:', this.userData.email)
    if (confirm('Do you want to delete your account permanently?')) {
      this.fetchApiData.deleteUser(this.user).subscribe(() => {
        this.snackbar.open('Account deleted successfully!', 'OK', {
          duration: 3000,
        });
        localStorage.clear();
        this.router.navigate(['welcome']);
      });
    }
  }



  // Update user data
  // updateUser(): void {
  //   const username = localStorage.getItem('username');
  //   if (username) {
  //     const userData = {
  //       username: this.userData.username,
  //       password: this.userData.password,
  //       email: this.userData.email,
  //       birthDate: this.userData.birthDate,
  //     };

  //     this.fetchApiData.editUser(username, userData).subscribe(
  //       (resp: any) => {
  //         this.snackBar.open('User profile updated successfully', 'OK', {
  //           duration: 2000,
  //         });
  //         localStorage.setItem('username', resp.username); // Update local storage if username changes
  //       },
  //       error => {
  //         this.snackBar.open('Error updating user profile', 'OK', {
  //           duration: 2000,
  //         });
  //       }
  //     );
  //   } else {
  //     this.snackBar.open('Username not found in local storage', 'OK', {
  //       duration: 2000,
  //     });
  //   }
  // }

  // // Fetch all movies and filter favorite movies
  // getAllMovies(): void {
  //   this.fetchApiData.getAllMovies().subscribe((movies: any) => {
  //     this.allMovies = movies;
  //     this.filterFavoriteMovies();
  //   });
  // }

  // // Filter favorite movies
  // filterFavoriteMovies(): void {
  //   if (this.user.FavoriteMovies) {
  //     this.favoriteMovies = this.allMovies.filter((movie: any) =>
  //       this.user.FavoriteMovies.includes(movie._id)
  //     );
  //   }
  // }

  // // Remove movie from favorite
  // removeFavoriteMovie(movieId: string): void {
  //   const username = localStorage.getItem('username');

  //   if (username) {
  //     this.fetchApiData.deleteFavoriteMovie(username, movieId).subscribe(() => {
  //       this.snackBar.open('Movie removed from favorites', 'OK', {
  //         duration: 3000,
  //       });
  //       this.getUser(); // Refresh favorite movies
  //     });
  //   } else {
  //     this.snackBar.open('Error: Username not found', 'OK', {
  //       duration: 2000,
  //     });
  //   }
  // }

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
