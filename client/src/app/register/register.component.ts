import { Component, OnInit } from "@angular/core";
import { UserService } from "../user-service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (localStorage.token) this.router.navigate(["/"]);
  }

  onSubmit(data) {
    let self = this;
    if (data.password !== data.confirmPassword) {
      this.userService.setError(500, "Passwords don't match");
    } else {
      this.userService
        .register(data.name, data.email, data.password)
        .then(res => {
          if (!res) self.router.navigate(["/login"]);
        });
    }
  }
}