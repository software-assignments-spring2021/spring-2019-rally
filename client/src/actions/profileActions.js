import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING,  CLEAR_CURRENT_PROFILE, GET_ERRORS} from './types';

//get current profile
export const getCurrentProfile = () => dispatch => {

    dispatch(setProfileLoading());

    axios.get('api/rally/get')
        .then(res =>

            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_PROFILE,
                payload: {}
            })
        );
        
};

export const createRally = (rallyData, history) => dispatch => {
    axios
        .post('api/rally/post', rallyData)
        .then (res => history.push('/profile'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

// profile LOADING
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    };
};

// Clear profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    };
};
