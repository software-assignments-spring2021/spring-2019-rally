const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function valiateRallyInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.duration = !isEmpty(data.duration) ? data.duration : '';


  if(Validator.isEmpty(data.name)) {
    errors.name = 'Rally name is required';
  }

  if(Validator.isEmpty(data.duration)) {
    errors.duration = 'Approximate duration is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
