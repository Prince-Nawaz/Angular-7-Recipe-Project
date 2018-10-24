import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataStorageService } from '../../shared/data-storage.service';
// import { HttpEvent, HttpEventType } from '@angular/common/http';
import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../../auth/store/auth.reducers';
import * as AuthActions from '../../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  authState: Observable<fromAuth.State>;

  constructor(private dataStorageService: DataStorageService,
              private router: Router,
              private store: Store<fromApp.AppState>) {}

    ngOnInit() {
      this.authState = this.store.select('auth');
    }

  onSaveData() {
    this.dataStorageService.storeRecipes()
    .subscribe(
      // (data: HttpEvent<Object>) => {
      (data) => {
         console.log(data);
        // console.log(data.type === HttpEventType.Sent);
        // console.log(data.type === HttpEventType.Response);
        console.log('Data saved successfully.');
      },
      (error) => { console.log(error); }
    );
  }

  onFetchData() {
    this.dataStorageService.getRecipes();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
