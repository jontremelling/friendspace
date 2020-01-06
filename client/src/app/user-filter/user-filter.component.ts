import { Component, OnInit } from "@angular/core";
import { UserService } from "../user-service";
import { Observable } from "rxjs";
import { UserStore } from "../models/userstore";
import { User } from "../models/user";
import { select, Store } from "@ngrx/store";

@Component({
  selector: "app-user-filter",
  templateUrl: "./user-filter.component.html",
  styleUrls: ["./user-filter.component.css"]
})
export class UserFilterComponent implements OnInit {
  filter: string;
  user_store: Observable<UserStore>;
  users: Array<User>;

  constructor(
    private store: Store<{ users: UserStore }>,
    private userService: UserService
  ) {
    this.user_store = store.pipe(select("users"));
    this.user_store.subscribe(
      res =>
        (this.users = res.filtered_users.filter(user => {
          return user.id !== res.current_user.id;
        }))
    );
  }

  ngOnInit() {
    this.userService.filterUsers("");
  }

  onChange(filter) {
    this.filter = filter;
    this.userService.filterUsers(filter);
  }

  getNotification(contact) {
    this.userService.addContact(contact);
  }
}