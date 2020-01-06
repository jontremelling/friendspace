import { Component, OnInit } from "@angular/core";
import { UserService } from "../user-service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (localStorage.token) this.router.navigate(["/"]);
  }

  onSubmit(data) {
    let self = this;
    this.userService.login(data.email, data.password).then(res => {
      if (!res) self.router.navigate(["/"]);
    });
  }
}