import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as fromAuth from './store/auth.reducers';
import { pipe, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()

export class AuthGaurdService implements CanActivate, CanLoad {

  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select('auth').pipe(take(1), map(
      (authState: fromAuth.State) => {
        if (authState.authenticated) {
          return authState.authenticated;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }
    ));

  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {

    return this.store.select('auth').pipe(take(1), map(
      (authState: fromAuth.State) => {
        if (authState.authenticated) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }
    ));
  }
}
