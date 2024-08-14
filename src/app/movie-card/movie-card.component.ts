import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { SynopsisCardComponent } from '../synopsis-card/synopsis-card.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit{
  movies: any[] = [];
  username: any = {};
  userData = { userId: '', favoriteMovie:[] }
  favoriteMovie: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (response: any) => {
        this.movies = response;
        console.log("Movie list ", this.movies);
      },
      (error) => {
        console.error('Error fetching movies:', error);
        this.snackbar.open('Error fetching movies', 'OK', { duration: 3000 });
      }
    );
  }

  getFavorites(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      if (Array.isArray(resp)) {
        this.movies = resp;
        // Loop through each movie and push its ID into favoritemovie array
        this.movies.forEach((movie: any) => {
          this.favoriteMovie.push(movie._id);
        });
      }
    });
  }

  isFavorite(movie: any): boolean {
    return this.favoriteMovie.includes(movie._id);
  }

  toggleFavorite(movie: any): void {
    console.log('toggleFavorite called with movie:', movie);
    const isFavorite = this.isFavorite(movie);
    console.log('isFavorite:', isFavorite);
    isFavorite
      ? this.deleteFavoriteMovie(movie)
      : this.addFavoriteMovie(movie);
  }

  addFavoriteMovie(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      console.log('username:', parsedUser);
      this.userData.userId = parsedUser._id;
      console.log('userData:', this.userData);
      this.fetchApiData.addFavoriteMovie(parsedUser.username, movie._id).subscribe((response) => {
        console.log('server response:', response);
        localStorage.setItem('user', JSON.stringify(response));
        // Add the movie ID to the favoritemovie array
        this.favoriteMovie.push(movie._id);
        // Show a snack bar message
        this.snackbar.open('Added to your favorites', 'OK', {
          duration: 3000,
        });
      });
    }
  }

  deleteFavoriteMovie(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData.deleteFavoriteMovie(parsedUser.userName, movie._id).subscribe((resp) => {
        localStorage.setItem('user', JSON.stringify(resp));
        // Remove the movie ID from the favoritemovie array
        this.favoriteMovie = this.favoriteMovie.filter((id) => id !== movie._id);
        // Show a snack bar message
        this.snackbar.open('Removed from your favorites', 'OK', {
          duration: 3000,
        });
      });
    }
  }

  openGenreDialog(movie: any): void {
    this.dialog.open(GenreCardComponent, {
      data: {
        Genre: String(movie.Genre.Name),
        Description: movie.Genre.Description
      },
      width: '500px',
    })
  }

  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorCardComponent, {
      data: {
        Name: String(movie.Director.Name),
        Bio: String(movie.Director.Bio),
        Birth: String(movie.Director.Birth)
      },
      width: '500px',
    })
  }

  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisCardComponent, {
      data: {
        Name: String(movie.Title),
        Description: String(movie.Description),
      },
      width: '500px',
    })
  }

}
