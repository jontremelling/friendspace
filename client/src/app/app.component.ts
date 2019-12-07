import { Component, ViewChild } from '@angular/core';
import { UserService } from './user-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'friendspace';
  errors: Array<string>;

    constructor(private userService: UserService) { 
        userService.getErrors().subscribe(errors => {
            this.errors = errors;
            let self = this;
            setTimeout(function() {
                self.errors = [];
            }, 3000);
        });
    }
}
