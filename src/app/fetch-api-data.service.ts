import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

/**
 * API URL
 */
const apiUrl = 'https://be-myflix-9ae503e43319.herokuapp.com';

/**
 * Injectable service for fetching data from the API.
 */
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param userData - The details of the user to be registered.
   * @returns An observable with the registration response.
   */
  public userRegistration(userData: any): Observable<any> {
    console.log(userData);
    return this.http.post(`${apiUrl}/users`, userData).pipe(
    catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param userData - The user credentials.
   * @returns An observable with the login response.
   */
  public userLogin(userData: any): Observable<any> {
    console.log(userData);
    return this.http.post(`${apiUrl}/login`, userData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all Movies.
   * @returns An observable with all movies
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}/movies`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get Movie by Title.
   * @param title - The title fo the movie.
   * @returns An observable with the movie details.
   */
  public getMovieByTitle(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}/movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get Director
   * @returns An observable with the director details.
   */
  public getDirector(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + '/movies/director/:Name', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get Genre
   * @returns An observable with genre details.
   */
  public getGenre(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + '/movies/genre/:Name', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get User by username
   * @param username - The username of the current user.
   * @returns An observable of the user data.
   */
  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}/users/${username}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Update and edit username and data.
   * @param username - The username of the current user.
   * @param userData - The data of the current user.
   * @returns An observable of the updated user data.
   */
  public editUser(username: string, userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${apiUrl}/users/${username}`, userData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /** 
   * Delete user account
   * @param username - the username of the current user.
   * @returns an observable indicating successful deletion of account.
   */
  public deleteUser(username: string): Observable<string> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${apiUrl}/users/${username}`, {
        headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
        }),
        responseType: 'text' // Explicitly specify the response type as text
    }).pipe(
        map(response => {
            // Here we assume the response is plain text
            if (typeof response === 'string') {
                return response; // Return the response directly as a string
            } else {
                throw new Error('Unexpected response format');
            }
        })
    );
}

  /**
   * Add Favorite Movie
   * @param username - The username of the current user.
   * @param movieId - The movieId of the favorite movie.
   * @returns An observable indicating successful addition of favorite movie.
   */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${apiUrl}/users/${username}/movies/${movieId}`, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Delete Favorite Movie
   * @param username - The username of the current user.
   * @param movieId - The movieId of the favorite movie.
   * @returns An observable indicating successful deletion of favorite movie.
   */
  public deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${apiUrl}/users/${username}/movies/${movieId}`,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Extracts response data from HTTP response.
   * @param res - The HTTP response.
   * @returns Extracted response data.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  /**
   * Handles HTTP errors.
   * @param error - The HTTP error response.
   * @returns An observable with an error message.
   */
  public handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred while processing your request.'));
  }
  
}