import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    currentUser: string;

    constructor(private userService: UserService, private router: Router) { 
        userService.getCurrentUser()
        .subscribe(user => {
            this.currentUser = user;
        });
    }

  ngOnInit() {
    if(!localStorage.token)
      this.router.navigate(['/login']);
  }

}
