import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

    constructor(private userService: UserService) { }

    ngOnInit() {
    }
  
    onSubmit(data) {
      let self = this;
      this.userService.updateUser(data);
    };

  

}
