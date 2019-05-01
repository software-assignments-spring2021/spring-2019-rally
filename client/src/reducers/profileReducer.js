import {GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_PROFILES} from '../actions/types';

const initialState = {
    rally: null,
    rallies: null,
    loading: false
};

export default function(state = initialState, action) {
    switch(action.type){

        case PROFILE_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_PROFILE:

            // represents empty profile being loaded
            return {
                ...state,
                rally: action.payload,
                loading: false
            };
        case GET_PROFILES:
            return {
              ...state,
              rallies: action.payload,
              loading: false
            }
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                rally: null,
                rallies: null
            }
    
        default:
            return state;
    }
}
