import { Component, OnInit, Input } from "@angular/core";
import { UserService } from "../user-service";
import { Observable } from "rxjs";
import { UserStore } from "../models/userstore";
import { User } from "../models/user";
import { Contact } from "../models/contact";
import { select, Store } from "@ngrx/store";

@Component({
  selector: "app-user-contacts",
  templateUrl: "./user-contacts.component.html",
  styleUrls: ["./user-contacts.component.css"]
})
export class UserContactsComponent implements OnInit {
  user_store: Observable<UserStore>;
  contacts: Array<Contact>;
  private user: User;

  @Input()
  set currentUser(val: any) {
    this.user = val;
    if (this.user.id) {
      this.userService.getUserContacts(this.user.id);
    }
  }

  constructor(
    private store: Store<{ users: UserStore }>,
    private userService: UserService
  ) {
    this.user_store = store.pipe(select("users"));
    this.user_store.subscribe(res => {
      this.contacts = res.user_contacts;
    });
  }

  ngOnInit() {}
}