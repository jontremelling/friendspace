import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.css']
})
export class UserFilterComponent implements OnInit {
  users: Array<string>;
  filter: string;

  constructor(private userService: UserService) {
    userService.getFilteredUsers()
    .subscribe(users => {
        this.users = users
    });

    userService.getContacts()
      .subscribe(contacts => {
        this.userService.filterUsers(this.filter);
    });
   }

  ngOnInit() {
    this.userService.filterUsers('');
  }

  onChange(filter) {
    this.filter = filter;
    this.userService.filterUsers(filter);
  }

  getNotificationAdd(evt) {
    this.userService.addContact(evt);
  }

}
