import { Component, OnInit } from '@angular/core';
import { DataStorageService } from './shared/data-storage.service';
import * as firebase from 'firebase';
// const firebase = require('firebase/auth');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoading = true;

  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit() {

    const config = {
      apiKey: 'AIzaSyCJV4jEJDBAYtQyAriLyequE-NpXWjSOnA',
      authDomain: 'ng-recipe-book-50bb8.firebaseapp.com',
    };

    firebase.initializeApp(config);

    if (this.isLoading) {
      // this.dataStorageService.getRecipes();
      this.isLoading = false;
      }
  }

}
