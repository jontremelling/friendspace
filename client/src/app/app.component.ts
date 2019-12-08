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
  messages: Array<string>;
  errorTimer;
  messageTimer;

    constructor(private userService: UserService) { 
        userService.getErrors().subscribe(errors => {
            this.errors = errors;
            let self = this;
            this.errorTimer = setTimeout(() => {
                self.errors = [];
            }, 3000);
        });

        userService.getMessages().subscribe(messages => {
            this.messages = messages;
            let self = this;
            this.messageTimer = setTimeout(() => {
                self.messages = [];
            }, 3000);
        });
    }
}
