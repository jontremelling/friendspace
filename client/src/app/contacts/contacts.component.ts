import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';

import { Observable } from 'rxjs';

import {UserStore} from '../models/userstore';
import {Contact} from '../models/contact';
import {select, Store} from '@ngrx/store';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
    user_store: Observable<UserStore>;
    contacts: Array<Contact>;

    constructor(private store: Store<{ users: UserStore }>, private userService: UserService) {
      this.user_store = store.pipe(select('users'));
      this.user_store.subscribe(res => this.contacts = res.user_contacts);
     }

  ngOnInit() {
    this.userService.getUserContacts();
  }

  getNotification(contact) {
    this.userService.deleteContact(contact);
  }

}
