import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, switchMap, map, catchError } from 'rxjs/operators';

import * as fromRecipe from '../store/recipe.reducers';
import * as RecipeActions from './recipe.actions';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeEffects {

  constructor(private action$: Actions,
    private store: Store<fromRecipe.FeatureState>,
    private httpClient: HttpClient) {}

  @Effect()
  fetchRecipes = this.action$
  .ofType(RecipeActions.FETCH_RECIPES)
  .pipe(
   switchMap((action: RecipeActions.FetchRecipes) => {
      // const token = this.authService.getToken();

      // return this.httpclient.get<Recipe[]>('https://ng-recipe-book-50bb8.firebaseio.com/recipes.json?auth=' + token)
      return this.httpClient.get<Recipe[]>('https://ng-recipe-book-50bb8.firebaseio.com/recipes.json', {
        observe: 'body', // response | body
        responseType: 'json' // json | text | blob | arraybuffer
        // params: new HttpParams().set('auth', token)
      });
   }),
   map((recipes) => {
     for (const recipe of recipes) {
       if (! recipe['ingredients']) {
         recipe.ingredients = [];
       }
     }
     return {
       type: RecipeActions.SET_RECIPES,
       payload: recipes
     };
   }),
   catchError((response: Response) => {
     return throwError('something went wrong while fetching data...');
   })
  );


  @Effect({ dispatch: false })
  storeRecipes = this.action$
  .ofType(RecipeActions.STORE_RECIPES)
  .pipe(
    withLatestFrom(this.store.select('recipes')),
    switchMap(([action, state]) => {
      // const headers = new HttpHeaders().set('Authorization', 'Bearer abcdefghij').append('Content-Type', 'application/json');

    // return this.httpclient.put('https://ng-recipe-book-50bb8.firebaseio.com/recipes.json', this.recipeService.getRecipes(), {
    //   observe: 'body',
    //   params: new HttpParams().set('auth', token)
    //   // headers: headers
    // })
    const request = new HttpRequest('PUT', 'https://ng-recipe-book-50bb8.firebaseio.com/recipes.json',
    state.recipes, { reportProgress: true });

    return this.httpClient.request(request);
    }),
    map((response) => {
      return response;
    }),
    catchError((response) => {
      return throwError('something went wrong while storing recipes...');
    })
  );
}
