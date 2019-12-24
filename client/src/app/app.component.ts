import { Component, ViewChild } from '@angular/core';
import { UserService } from './user-service';
import { Observable } from 'rxjs';
import {MessageStore} from './models/messagestore';
import {Message} from './models/message';
import {select, Store} from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'friendspace';
  message_store: Observable<MessageStore>;
  errors: Array<Message>;
  messages: Array<Message>;
  errorTimer;
  messageTimer;

    constructor(private store: Store<{ messages: MessageStore }>, private userService: UserService) { 
        this.message_store = store.pipe(select('messages'));
        this.message_store.subscribe(res => this.errors = res.errors);
        this.message_store.subscribe(res => this.messages = res.messages);
    }
}
