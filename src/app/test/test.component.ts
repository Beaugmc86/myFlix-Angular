import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  userData: any;

  constructor(private fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
  console.log('Username from localStorage:', username); // Should log 'beautest1'
  
  if (username) {
    this.fetchApiData.getUser(username).subscribe(
      (response) => {
        console.log('User data received:', response); // Should log the user data received
        this.userData = response;
      },
      (error) => {
        console.error('Error fetching user data:', error); // Log any errors
      }
    );
  } else {
    console.error('No username found in localStorage');
  }
}
}
