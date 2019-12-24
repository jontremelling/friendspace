import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import {UserStore} from '../models/userstore';
import {User} from '../models/user';
import {select, Store} from '@ngrx/store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    user_store: Observable<UserStore>;
    currentUser: User;

  constructor(private store: Store<{ users: UserStore }>, private userService: UserService, private router: Router) { 
    this.user_store = store.pipe(select('users'));
    this.user_store.subscribe(res => this.currentUser = res.current_user);
  }

  ngOnInit() {
    this.userService.loadUser();
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  };
  

}
