import {ActionEx, MessageActionTypes} from '../actions/message.actions';
export const initialState = {
    messages: [],
    errors: []
};
export function MessageReducer(state = initialState, action: ActionEx) {
  switch (action.type) {
    case MessageActionTypes.AddMessage:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case MessageActionTypes.RemoveMessage:
        return {
            ...state, 
            messages: state.messages.filter(message => message.id !== action.payload)
        };
    case MessageActionTypes.ClearMessages:
        return {
            ...state, 
            filtered_users: []
        }
    case MessageActionTypes.AddError:
        return {
            ...state,
            errors: [...state.errors, action.payload]
        };
    case MessageActionTypes.RemoveError:
        return {
            ...state, 
            errors: state.errors.filter(error => error.id !== action.payload)
        };
    case MessageActionTypes.ClearErrors:
        return {
            ...state, 
            errors: []
        }
    default:
      return state;
  }
}
