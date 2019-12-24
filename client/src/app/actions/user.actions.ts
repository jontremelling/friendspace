import {Action} from '@ngrx/store';

export enum UserActionTypes {
  SetCurrentUser = '[User Component] SetCurrentUser',
  RemoveCurrentUser = '[User Component] RemoveCurrentUser',
  AddFilteredUser = '[User Component] Add',
  RemoveFilteredUser = '[User Component] Remove',
  ClearFilteredUsers = '[User Component] Clear',
  Add = '[Contact Component] Add',
  Remove = '[Contact Component] Remove',
  Clear = '[Contact Component] Clear'
}
export class ActionEx implements Action {
  readonly type;
  payload: any;
}
export class SetCurrentUser implements ActionEx {
    readonly type = UserActionTypes.SetCurrentUser;
    constructor(public payload: any) {
    }
}
export class RemoveCurrentUser implements ActionEx {
    readonly type = UserActionTypes.RemoveCurrentUser;
    constructor(public payload: any) {
    }
}
export class UserAdd implements ActionEx {
  readonly type = UserActionTypes.AddFilteredUser;
  constructor(public payload: any) {
  }
}
export class UserRemove implements ActionEx {
  readonly type = UserActionTypes.RemoveFilteredUser;
  constructor(public payload: any) {
  }
}
export class UserClear implements ActionEx {
    readonly type = UserActionTypes.ClearFilteredUsers;
    constructor(public payload: any) {
    }
}
export class ContactAdd implements ActionEx {
    readonly type = UserActionTypes.Add;
    constructor(public payload: any) {
    }
}
export class ContactRemove implements ActionEx {
    readonly type = UserActionTypes.Remove;
    constructor(public payload: any) {
    }
}
export class ContactClear implements ActionEx {
    readonly type = UserActionTypes.Clear;
    constructor(public payload: any) {
    }
}
