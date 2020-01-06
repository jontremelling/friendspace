import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { UserService } from "../user-service";
import { Router } from "@angular/router";

import { Observable } from "rxjs";
import { UserStore } from "../models/userstore";
import { User } from "../models/user";
import { select, Store } from "@ngrx/store";

@Component({
  selector: "app-contact-form",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.css"]
})
export class ContactFormComponent implements OnInit {
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  user_store: Observable<UserStore>;
  currentUser: User;

  constructor(
    private store: Store<{ users: UserStore }>,
    private userService: UserService,
    private router: Router
  ) {
    this.user_store = store.pipe(select("users"));
    this.user_store.subscribe(res => (this.currentUser = res.current_user));
  }

  ngOnInit() {}

  onSubmit(data) {
    this.notifyParent.emit();
    this.userService.updateUser(data);
  }

  deleteAccount() {
    this.userService.deleteAccount(this.currentUser.id).then(res => {
      this.userService.logout();
      this.router.navigate(["/login"]);
    });
  }

  cancelEdit() {
    this.notifyParent.emit();
  }
}