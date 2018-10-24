import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, switchMap, mergeMap, tap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import * as firebase from 'firebase';

import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';

@Injectable()

export class AuthEffects {

  constructor(private actions$: Actions, private router: Router) {}

  @Effect()
  authSignup = this.actions$
  .ofType(AuthActions.TRY_SIGNUP)
  .pipe(
    map((action: AuthActions.TrySignup) => action.payload  ),
    switchMap((authData: { username: string, password: string}) => {
      return from(
        firebase.auth().createUserWithEmailAndPassword(authData.username, authData.password)
        ).pipe(
          switchMap(() => from(firebase.auth().currentUser.getIdToken())),
          mergeMap((token: string) => {
            this.router.navigate(['/recipes']);
            console.log('signup Successfully');
            return [
              {
              type: AuthActions.SIGNUP
              },
              {
                type: AuthActions.SET_TOKEN,
                payload: token
              }
            ];

          }),
          catchError(err => {
            console.log('Signup Error', err);
            return of({ type: AuthActions.AUTH_FAIL, payload: err });
          })
        );
    })
    );

  @Effect()
  authSignin = this.actions$
  .ofType(AuthActions.TRY_SIGNIN)
  .pipe(
    map((action: AuthActions.TrySignin) => action.payload ),
    switchMap((authData: {username: string, password: string}) => {
      return from(firebase.auth().signInWithEmailAndPassword(authData.username, authData.password))
      .pipe(
        switchMap(() => {
          return from(firebase.auth().currentUser.getIdToken());
        }),
        mergeMap((token: string) => {
          this.router.navigate(['/recipes']);
          console.log('Logged in Successfully');
          return [
            {
              type: AuthActions.SIGNIN
            },
            {
              type: AuthActions.SET_TOKEN,
              payload: token
            }
          ];
        }),
        catchError(err => {
          console.log('Signin Error', err);
          return of({ type: AuthActions.AUTH_FAIL, payload: err });
        })
      );
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$
  .ofType(AuthActions.LOGOUT)
  .pipe(
    tap(() => {
      firebase.auth().signOut();
      this.router.navigate(['/signin']);
      console.log('Logged out Successfully');
    })
  );
}
