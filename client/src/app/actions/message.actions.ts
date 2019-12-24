import {Action} from '@ngrx/store';
export enum MessageActionTypes {
  AddMessage = '[Message Component] AddMessage',
  RemoveMessage = '[Message Component] RemoveMessage',
  ClearMessages = '[Message Component] ClearMessages',
  AddError = '[Message Component] AddError',
  RemoveError = '[Message Component] RemoveError',
  ClearErrors = '[Message Component] ClearErrors'
}
export class ActionEx implements Action {
  readonly type;
  payload: any;
}
export class AddMessage implements ActionEx {
  readonly type = MessageActionTypes.AddMessage;
  constructor(public payload: any) {
  }
}
export class RemoveMessage implements ActionEx {
  readonly type = MessageActionTypes.RemoveMessage;
  constructor(public payload: any) {
  }
}
export class ClearMessages implements ActionEx {
    readonly type = MessageActionTypes.ClearMessages;
    constructor(public payload: any) {
    }
}
export class AddError implements ActionEx {
    readonly type = MessageActionTypes.AddError;
    constructor(public payload: any) {
    }
}
export class RemoveError implements ActionEx {
    readonly type = MessageActionTypes.RemoveError;
    constructor(public payload: any) {
    }
}
export class ClearErrors implements ActionEx {
    readonly type = MessageActionTypes.ClearErrors;
    constructor(public payload: any) {
    }
}
