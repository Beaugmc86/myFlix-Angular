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
  favoriteMovies: string[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);       
      });
    }

  getFavoriteMovies(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe((user: any) => {
        this.favoriteMovies = user.FavoriteMovies;
        console.log(this.favoriteMovies);
      });
    } else {
      this.snackbar.open('Error: Username not found', 'OK', { duration: 3000 });
    }
  }

  toggleFavorite(movie: any): void {
    if (this.isFavorite(movie)) {
      this.removeFavorite(movie);
    } else {
      this.addFavorite(movie);
    }
  }

  addFavorite(movie: any): void {
    const username = localStorage.getItem('username');
      if (username) {
      this.fetchApiData.addFavoriteMovie(username, movie._id).subscribe(() => {
        this.snackbar.open(`${movie.Title} added to favorites`, 'OK', { duration: 3000 });
        this.getFavoriteMovies(); // Refresh favorite movies to update UI
      });
    } else {
      this.snackbar.open('Error: Username not found', 'OK', { duration: 3000 });
    }
  }

  removeFavorite(movie: any): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.deleteFavoriteMovie(username, movie._id).subscribe(() => {
        this.snackbar.open(`${movie.Title} removed from favorites`, 'OK', { duration: 3000 });
        this.getFavoriteMovies(); // Refresh favorite movies to update UI
      });
    } else {
      this.snackbar.open('Error: Username not found', 'OK', { duration: 3000 });
    }
  }

  isFavorite(movie: any): boolean {
    return this.favoriteMovies.includes(movie._id);
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
