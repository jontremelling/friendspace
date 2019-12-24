import {ActionEx, UserActionTypes} from '../actions/user.actions';
import {User} from '../models/user';

const initialState = {
    current_user: User,
    filtered_users: [],
    user_contacts: []
};
export function UserReducer(state = initialState, action: ActionEx) {
  switch (action.type) {
    case UserActionTypes.AddFilteredUser:
      return {
        ...state, 
        filtered_users: [...state.filtered_users, action.payload]
      };
    case UserActionTypes.RemoveFilteredUser:
      return {
        ...state, 
        filtered_users: state.filtered_users.filter(user => user.id !== action.payload)
      };
    case UserActionTypes.ClearFilteredUsers:
        return {
            ...state, 
            filtered_users: []
        }
    case UserActionTypes.Add:
        return {
            ...state,
            user_contacts: [...state.user_contacts, action.payload]
        };
    case UserActionTypes.Remove:
        return {
            ...state, 
            user_contacts: state.user_contacts.filter(contact => contact.id !== action.payload)
        }
    case UserActionTypes.Clear:
        return {
            ...state, 
            user_contacts: []
        }
    case UserActionTypes.SetCurrentUser:
        return {
            ...state,
            current_user: action.payload
        }
    case UserActionTypes.RemoveCurrentUser:
        return {
            ...state,
            current_user: {}
        }
    default:
      return state;
  }
}
