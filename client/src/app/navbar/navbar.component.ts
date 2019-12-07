import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: string;

  constructor(private userService: UserService, private router: Router) { 
    userService.getCurrentUser()
    .subscribe(user => this.currentUser = user);
  }

  ngOnInit() {
    this.userService.loadUser();
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  };
  

}
