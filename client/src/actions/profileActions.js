import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING,  CLEAR_CURRENT_PROFILE, GET_ERRORS, GET_PROFILES, GET_TIMES} from './types';

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

export const getRallies = (user) => dispatch => {
  dispatch(setProfileLoading());

  axios
      .post('api/rally/get', user)
      .then(res =>
          dispatch({
              type: GET_PROFILES,
              payload: res.data
          })
      )
      .catch(err =>
          dispatch({
              type: GET_PROFILES,
              payload: null
          })
      );
}

export const getRallyByID = (rallyID) => dispatch => {
  dispatch(setProfileLoading());

  axios
      .get(`/api/rally/rallyID/${rallyID}`)
      .then(res =>
          dispatch({
              type: GET_PROFILES,
              payload: res.data
          })

      )
      .catch(err =>
          dispatch({
              type: GET_PROFILES,
              payload: null
          })
      );
}

export const getTimeslots = (data) => dispatch => {
  dispatch(setProfileLoading());

  axios
      .post(`/api/rally/returnCompare`, data)
      .then(res =>
          dispatch({
              type: GET_TIMES,
              payload: res.data
          })

      )
      .catch(err =>
          dispatch({
              type: GET_TIMES,
              payload: null
          })
      );
}

export const createRally = (rallyData, history) => dispatch => {
    axios
        .post('api/rally/create', rallyData)
        .then (res => history.push('/rally'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

// add location
export const addLocations = (locationData, history) => dispatch => {



    axios
        .post('api/rally/addLocations', locationData)
        .then(res =>
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            })
        )
        .catch(err =>
            console.log(err)
            // dispatch({
            //     type: GET_ERRORS,
            //     payload: err.response.data
            // })
        );
}

export const confirmDetails = (data, history) => dispatch => {
    axios
        .post('/api/rally/confirm', data)
        .then(res =>
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            }),(history.push('/rally'))
        )
        .catch(err =>
            console.log(err)
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
