import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';

@Injectable()

export class DataStorageService {

  constructor(private httpclient: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    // const headers = new HttpHeaders().set('Authorization', 'Bearer abcdefghij').append('Content-Type', 'application/json');

    // return this.httpclient.put('https://ng-recipe-book-50bb8.firebaseio.com/recipes.json', this.recipeService.getRecipes(), {
    //   observe: 'body',
    //   params: new HttpParams().set('auth', token)
    //   // headers: headers
    // })
    const request = new HttpRequest('PUT', 'https://ng-recipe-book-50bb8.firebaseio.com/recipes.json',
    this.recipeService.getRecipes(), { reportProgress: true });

    return this.httpclient.request(request)
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((response) => {
        return throwError('something went wrong while storing recipes...');
      })
    );
  }

  getRecipes() {
    // const token = this.authService.getToken();

    // return this.httpclient.get<Recipe[]>('https://ng-recipe-book-50bb8.firebaseio.com/recipes.json?auth=' + token)
    return this.httpclient.get<Recipe[]>('https://ng-recipe-book-50bb8.firebaseio.com/recipes.json', {
      observe: 'body', // response | body
      responseType: 'json' // json | text | blob | arraybuffer
      // params: new HttpParams().set('auth', token)
    })
    .pipe(
      map((recipes) => {
        for (const recipe of recipes) {
          if (! recipe['ingredients']) {
            recipe.ingredients = [];
          }
        }
        return recipes;
      }),
      catchError((response: Response) => {
        return throwError('something went wrong while fetching data...');
      })
    ).subscribe(
      (recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
        console.log('Data Fetched successfully.');
      },
      (error) => { console.log(error); }
    );
  }
}
