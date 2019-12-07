import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
    contacts: Array<string>;

    constructor(private userService: UserService) {
      userService.getContacts()
      .subscribe(contacts => {
          this.contacts = contacts
      });
     }

  ngOnInit() {
    this.userService.getUserContacts();
  }

  getNotification(evt) {
    this.userService.deleteContact(evt);
  }

}
