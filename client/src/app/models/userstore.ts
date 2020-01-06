import { User } from "./user";
import { Contact } from "./contact";

export class UserStore {
  current_user: User;
  filtered_users: Array<User>;
  user_contacts: Array<Contact>;
}