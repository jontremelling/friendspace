import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FileUploadService } from "../shared/file-upload.service";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Observable } from "rxjs";
import { UserStore } from "../models/userstore";
import { User } from "../models/user";
import { select, Store } from "@ngrx/store";

import { UserService } from "../user-service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  preview: string;
  form: FormGroup;
  percentDone: any = 0;
  users: Array<User>;
  edit_mode = false;
  edit_profile = false;
  queryParamsStatus = "";

  user_store: Observable<UserStore>;
  currentUser: User;
  loggedInUser: User;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public fileUploadService: FileUploadService,
    private store: Store<{ users: UserStore }>,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.user_store = store.pipe(select("users"));
    this.user_store.subscribe(res => {
      this.users = res.filtered_users;

      let filtered_user = this.users.find(user => {
        return user.id === this.queryParamsStatus;
      });
      this.currentUser = filtered_user;
      this.loggedInUser = res.current_user;
    });

    this.route.params.subscribe((params: Params) => {
      this.queryParamsStatus = params["user-id"];
    });

    // Reactive Form
    this.form = this.fb.group({
      name: [""],
      avatar: [null]
    });
  }

  ngOnInit() {
    this.userService.filterUsers("");
  }

  // Image Preview
  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get("avatar").updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submitForm() {
    this.edit_mode = false;
    this.fileUploadService
      .addUser(this.currentUser.id, this.form.value.avatar)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log("Request has been made!");
            break;
          case HttpEventType.ResponseHeader:
            console.log("Response header has been received!");
            break;
          case HttpEventType.UploadProgress:
            this.percentDone = Math.round((event.loaded / event.total) * 100);
            console.log(`Uploaded! ${this.percentDone}%`);
            break;
          case HttpEventType.Response:
            console.log("User successfully created!", event.body);
            this.percentDone = false;
            this.router.navigate(["users-list"]);
        }
      });
  }

  cancelImageUpload() {
    delete this.preview;
    this.edit_mode = false;
  }

  edit() {
    this.edit_mode = true;
  }

  editProfileInformation() {
    this.edit_profile = true;
  }

  getNotification() {
    this.edit_profile = false;
  }

  hideUserEmail() {
    this.currentUser.hideUserEmail = true;
    this.userService.updateUser(this.currentUser);
  }

  showUserEmail() {
    this.currentUser.hideUserEmail = false;
    this.userService.updateUser(this.currentUser);
  }

  newPost(post) {
    this.currentUser.posts.push({
      poster: this.loggedInUser,
      post: post,
      id: this.makeid(10),
      date: Date.now()
    });
    this.userService.updateUser(this.currentUser);
  }

  removePost(postId) {
    this.currentUser.posts = this.currentUser.posts.filter(
      post => post.id !== postId
    );
    this.userService.updateUser(this.currentUser);
  }

  makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
