import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import axios from "axios";

import { UserStore } from "./models/userstore";
import { MessageStore } from "./models/messagestore";
import { Message } from "./models/message";
import { Contact } from "./models/contact";
import { User } from "./models/user";
import { Store } from "@ngrx/store";

import {
  SetCurrentUser,
  RemoveCurrentUser,
  UserAdd,
  UserRemove,
  UserClear,
  ContactAdd,
  ContactRemove,
  ContactClear
} from "./actions/user.actions";

import {
  AddError,
  RemoveError,
  ClearErrors,
  AddMessage,
  RemoveMessage,
  ClearMessages
} from "./actions/message.actions";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private store: Store<{ users: UserStore[]; messages: MessageStore[] }>
  ) {}

  login(username: string, password: string) {
    return axios
      .post("http://localhost:5000/api/auth", {
        email: username,
        password: password
      })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        return this.loadUser();
      })
      .catch(error => {
        let errorObj = new Message();
        if (error.response.data.msg) {
          errorObj.id =
            Math.random()
              .toString(36)
              .substring(2, 15) +
            Math.random()
              .toString(36)
              .substring(2, 15);
          errorObj.message = error.response.data.msg;
          this.store.dispatch(new AddError(errorObj));

          setTimeout(() => {
            this.store.dispatch(new RemoveError(errorObj.id));
          }, 3000);
        }

        if (error.response.data.errors) {
          error.response.data.errors.map(err => {
            errorObj.id =
              Math.random()
                .toString(36)
                .substring(2, 15) +
              Math.random()
                .toString(36)
                .substring(2, 15);
            errorObj.message = err.msg;
            this.store.dispatch(new AddError(errorObj));

            setTimeout(() => {
              this.store.dispatch(new RemoveError(errorObj.id));
            }, 3000);
          });
        }
      });
  }

  register(username: string, email: string, password: string) {
    return axios
      .post("http://localhost:5000/api/users", {
        name: username,
        email: email,
        password: password
      })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        return this.loadUser();
      })
      .catch(error => {
        let errorObj = new Message();
        if (error.response.data.msg) {
          errorObj.id =
            Math.random()
              .toString(36)
              .substring(2, 15) +
            Math.random()
              .toString(36)
              .substring(2, 15);
          errorObj.message = error.response.data.msg;
          this.store.dispatch(new AddError(errorObj));

          setTimeout(() => {
            this.store.dispatch(new RemoveError(errorObj.id));
          }, 3000);
        }

        if (error.response.data.errors) {
          error.response.data.errors.map(err => {
            errorObj.id =
              Math.random()
                .toString(36)
                .substring(2, 15) +
              Math.random()
                .toString(36)
                .substring(2, 15);
            errorObj.message = err.msg;
            this.store.dispatch(new AddError(errorObj));

            setTimeout(() => {
              this.store.dispatch(new RemoveError(errorObj.id));
            }, 3000);
          });
        }
      });
  }

  loadUser() {
    if (!localStorage.token) return {};

    let data = {
      "content-type": "application/json",
      "x-auth-token": localStorage.token
    };

    return axios
      .get("http://localhost:5000/api/auth", { headers: data })
      .then(res => {
        const user = new User();
        user.id = res.data._id;
        user.name = res.data.name;
        user.email = res.data.email;
        user.hideUserEmail = res.data.hideUserEmail;
        user.posts = res.data.posts;
        user.avatar = res.data.avatar;
        user.contacts = res.data.contacts;
        this.store.dispatch(new SetCurrentUser(user));
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  filterUsers(filter) {
    if (!localStorage.token) return {};

    let data = {
      "content-type": "application/json",
      "x-auth-token": localStorage.token
    };

    return axios
      .get("http://localhost:5000/api/users", { headers: data })
      .then(res => {
        this.store.dispatch(new UserClear({}));
        res.data.map(u => {
          if (u.name && (!filter || u.name.toLowerCase().includes(filter))) {
            const user = new User();
            user.id = u._id;
            user.name = u.name;
            user.email = u.email;
            user.hideUserEmail = u.hideUserEmail;
            user.posts = u.posts;
            user.avatar = u.avatar;
            user.contacts = u.contacts;
            this.store.dispatch(new UserAdd(user));
          }
        });
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  getUserContacts(user_id = "") {
    if (!localStorage.token) return {};

    let data = {
      "content-type": "application/json",
      "x-auth-token": localStorage.token
    };

    return axios
      .get("http://localhost:5000/api/contacts", {
        params: { userId: user_id },
        headers: data
      })
      .then(res => {
        this.store.dispatch(new ContactClear({}));
        res.data.map(c => {
          const contact = new Contact();
          contact._id = c._id;
          contact.user_id = c.id;
          contact.name = c.name;
          contact.email = c.email;
          contact.posts = c.posts;
          this.store.dispatch(new ContactAdd(contact));
        });
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  updateUser(user) {
    let data = {
      "content-type": "application/json",
      "x-auth-token": localStorage.token
    };

    return axios
      .put("http://localhost:5000/api/users", user, { headers: data })
      .then(res => {
        let messageObj = new Message();
        messageObj.id =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);
        messageObj.message = "Username updated to " + res.data.name;
        this.store.dispatch(new AddMessage(messageObj));

        setTimeout(() => {
          this.store.dispatch(new RemoveMessage(messageObj.id));
        }, 3000);
      })
      .catch(err => {
        let errorObj = new Message();
        errorObj.id =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);
        errorObj.message = err.response.data.msg;
        this.store.dispatch(new AddError(errorObj));

        setTimeout(() => {
          this.store.dispatch(new RemoveError(errorObj.id));
        }, 3000);
      });
  }

  deleteContact(contact) {
    this.store.dispatch(new ContactRemove(contact._id));
    let data = {
      "content-type": "application/json",
      "x-auth-token": localStorage.token
    };

    return axios
      .delete(`http://localhost:5000/api/contacts/${contact._id}`, {
        headers: data
      })
      .then(res => {
        // const user = new User();
        // user.id = contact.user_id;
        // user.name = contact.name;
        // user.email = contact.email;
        // this.store.dispatch(new UserAdd(user));

        let messageObj = new Message();
        messageObj.id =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);
        messageObj.message = res.data.msg;
        this.store.dispatch(new AddMessage(messageObj));

        setTimeout(() => {
          this.store.dispatch(new RemoveMessage(messageObj.id));
        }, 3000);

        this.getUserContacts();
      });
  }

  addContact(contact) {
    let data = {
      "content-type": "application/json",
      "x-auth-token": localStorage.token
    };

    return axios
      .post(
        `http://localhost:5000/api/contacts`,
        {
          id: contact.id
        },
        { headers: data }
      )
      .then(res => {
        const new_contact = new Contact();
        new_contact._id = contact._id;
        new_contact.user_id = contact.id;
        new_contact.name = contact.name;
        new_contact.email = contact.email;
        this.store.dispatch(new ContactAdd(new_contact));
        this.store.dispatch(new UserRemove(contact.id));

        let messageObj = new Message();
        messageObj.id =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);
        messageObj.message = res.data.name + " added.";
        this.store.dispatch(new AddMessage(messageObj));

        setTimeout(() => {
          this.store.dispatch(new RemoveMessage(messageObj.id));
        }, 3000);

        this.getUserContacts();
      });
  }

  logout() {
    this.store.dispatch(new RemoveCurrentUser({}));
    delete localStorage.token;
  }

  deleteAccount(id) {
    let data = {
      "content-type": "application/json",
      "x-auth-token": localStorage.token
    };

    return axios
      .delete(`http://localhost:5000/api/users/${id}`, { headers: data })
      .then(res => {
        let messageObj = new Message();
        messageObj.id =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);
        messageObj.message = res.data.msg;
        this.store.dispatch(new AddMessage(messageObj));

        setTimeout(() => {
          this.store.dispatch(new RemoveMessage(messageObj.id));
        }, 3000);
      });
  }

  setError(code, error) {
    let errorObj = new Message();
    errorObj.id =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    errorObj.code = code;
    errorObj.message = error;
    this.store.dispatch(new AddError(errorObj));
  }
}