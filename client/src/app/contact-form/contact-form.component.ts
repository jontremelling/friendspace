import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

    currentUser: {_id: string, name: string};

    constructor(private userService: UserService, private router: Router) { 
        userService.getCurrentUser()
        .subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
    }
  
    onSubmit(data) {
      this.userService.updateUser(data);
    };

    deleteAccount() {
        this.userService.deleteAccount(this.currentUser._id)
        .then(res => {
            this.userService.logout();
            this.router.navigate(['/login']);
        });
    }

}
