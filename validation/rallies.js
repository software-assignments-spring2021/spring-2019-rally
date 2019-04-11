const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRallyInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.duration = !isEmpty(data.duration) ? data.duration : '';

  data.earliestTime = !isEmpty(data.earliestTime) ? data.earliestTime : '';
  data.latestTime = !isEmpty(data.latestTime) ? data.latestTime : '';
  data.location = !isEmpty(data.location) ? data.location : '';
  data.locationSuggRadius = !isEmpty(data.locationSuggRadius) ? data.locationSuggRadius : '';
  data.timeOfWeek = !isEmpty(data.timeOfWeek) ? data.timeOfWeek : '';



  if(Validator.isEmpty(data.name)) {
    errors.name = 'Rally name is required';
  }

  if(Validator.isEmpty(data.duration)) {
    errors.duration = 'Approximate duration is required';
  }

  /*
  members: [],
  owners: [],
  earliestTime: '',
  latestTime: '',
  location: '',
  locationSuggRadius: '',
  timeOfWeek: '',
  */

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
