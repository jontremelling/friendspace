import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _currentUser: BehaviorSubject<{_id: string, name: string}>;
  private _filteredUsers: BehaviorSubject<Array<string>>;
  private _contacts: BehaviorSubject<Array<string>>;
  private _errors: BehaviorSubject<Array<string>>;
  private _messages: BehaviorSubject<Array<string>>;

  constructor() { 
    this._currentUser = new BehaviorSubject({_id: "", name: ""});
    this._filteredUsers = new BehaviorSubject([]);
    this._contacts = new BehaviorSubject([]);
    this._errors = new BehaviorSubject([]);
    this._messages = new BehaviorSubject([]);
  }

  getCurrentUser(): Observable<{_id: string, name: string}> {
    return this._currentUser.asObservable();
  }

  getFilteredUsers(): Observable<Array<string>> {
    return this._filteredUsers.asObservable();
  }

  getContacts(): Observable<Array<string>> {
    return this._contacts.asObservable();
  }

  getErrors(): Observable<Array<string>> {
    return this._errors.asObservable();
  }

  getMessages(): Observable<Array<string>> {
    return this._messages.asObservable();
  }

  setUser(user: {_id: string, name: string}) {
    this._currentUser.next(user);
  }

  setFilteredUsers(users: Array<string>) {
      this._filteredUsers.next(users);
  }

  setContacts(contacts: Array<string>) {
    this._contacts.next(contacts);
  }

  setErrors(errors: Array<string>) {
    this._errors.next(errors);
  }

  setMessages(messages: Array<string>) {
    this._messages.next(messages);
  }

  login(username: String, password: String) {

    return axios.post('http://localhost:5000/api/auth', {
        email: username,
        password: password
    })
    .then(res => {
        localStorage.setItem("token", res.data.token);
        return this.loadUser();
    })
    .catch(error => {
        let errors: Array<string> = [];
        if(error.response.data.msg) {
            errors.push(error.response.data.msg);
        }

        if(error.response.data.errors) {
            error.response.data.errors.map(err => {
                errors.push(err.msg);
            });
        }
        this.setErrors(errors);
        return errors;
    });
  }

  register(username: String, email: String, password: String) {

    return axios.post('http://localhost:5000/api/users', {
        name: username,
        email: email,
        password: password
    })
    .then(res => {
        localStorage.setItem("token", res.data.token);
        return this.loadUser();
    })
    .catch((error) => {
        let errors: Array<string> = [];
        if(error.response.data.msg) {
            errors.push(error.response.data.msg);
        }

        if(error.response.data.errors) {
            error.response.data.errors.map(err => {
                errors.push(err.msg);
            });
        }
        this.setErrors(errors);
        return errors;
    });
  }

  loadUser() {
    if(!localStorage.token)
        return {};

    let data = {
        'content-type': 'application/json',
        'x-auth-token': localStorage.token
    }

    return axios.get("http://localhost:5000/api/auth", { headers: data})
    .then((res) => {
        const data = res.data;

        this.setUser(data);
    })
    .catch((err) => {
        console.log(err.response)
    });
  };

  filterUsers(filter) {
    if(!localStorage.token)
        return {};

    let data = {
        'content-type': 'application/json',
        'x-auth-token': localStorage.token
    }

    return axios.get("http://localhost:5000/api/users", { headers: data})
    .then((res) => {
        const data = res.data;

        this.setFilteredUsers(data.filter(user => {
            return user.name && (!filter || user.name.toLowerCase().includes(filter));
        }));
    })
    .catch((err) => {
        console.log(err.response)
    });
  };

  getUserContacts() {
    if(!localStorage.token)
        return {};

    let data = {
        'content-type': 'application/json',
        'x-auth-token': localStorage.token
    }

    return axios.get("http://localhost:5000/api/contacts", { headers: data})
    .then((res) => {
        this.setContacts(res.data);
    })
    .catch((err) => {
        console.log(err.response)
    });
  };

  updateUser(username) {
    let data = {
        'content-type': 'application/json',
        'x-auth-token': localStorage.token
    }

    return axios.put("http://localhost:5000/api/users", {
        name: username.name
    }, { headers: data})
    .then((res) => {
        const data = res.data;
        this.setUser(data);

        let messages: Array<string> = [];
        messages.push("Username updated to " + res.data.name);
        this.setMessages(messages);
    })
    .catch((err) => {
        let errors = [];
        errors.push(err.response.data.msg);
        this.setErrors(errors);
    });
  }

  deleteContact(id) {
    let data = {
        'content-type': 'application/json',
        'x-auth-token': localStorage.token
    }

    return axios.delete(`http://localhost:5000/api/contacts/${id}`, { headers: data})
        .then(res => {
            let messages: Array<string> = [];
            messages.push(res.data.msg);
            this.setMessages(messages);
            this.getUserContacts();
        })
  }

  addContact(id) {
    let data = {
        'content-type': 'application/json',
        'x-auth-token': localStorage.token
    }

    return axios.post(`http://localhost:5000/api/contacts`, {
        id: id
    }, { headers: data})
        .then(res => {
            let messages: Array<string> = [];
            messages.push(res.data.name + " added.");
            this.setMessages(messages);
            this.getUserContacts();
        })
  }

  logout() {
    this.setUser({_id: "", name: ""});
    delete localStorage.token;
  }

  deleteAccount(id) {
    let data = {
        'content-type': 'application/json',
        'x-auth-token': localStorage.token
    }

    return axios.delete(`http://localhost:5000/api/users/${id}`, { headers: data})
        .then(res => {
            let messages: Array<string> = [];
            messages.push(res.data.msg);
            this.setMessages(messages);
        })
  }
}
