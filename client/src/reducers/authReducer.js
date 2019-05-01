import { SET_CURRENT_USER , DELETE_ACCOUNT} from '../actions/types';

import isEmpty from '../validation/is-empty';

const initialState = {
  isAuthenticated: false,
  user: {}
}

export default function(state = initialState, action){
  switch(action.type){
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      }
     case DELETE_ACCOUNT:
        return {
            ...state,
            isAuthenticated: false,
            user: null
        }
    default:
      return state;
  }
}
