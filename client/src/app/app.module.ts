import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { UserService } from "./user-service";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { UserFilterComponent } from "./user-filter/user-filter.component";
import { UserContactsComponent } from "./user-contacts/user-contacts.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ContactComponent } from "./contact/contact.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";

import { StoreModule } from "@ngrx/store";
import { MessageReducer } from "./reducers/message.reducer";
import { UserReducer } from "./reducers/user.reducer";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactFormComponent,
    ContactsComponent,
    UserFilterComponent,
    UserContactsComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ContactComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ messages: MessageReducer, users: UserReducer })
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule {}