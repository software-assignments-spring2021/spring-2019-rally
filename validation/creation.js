const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCreationInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.owners = !isEmpty(data.owners) ? data.owners : [];
  data.members = !isEmpty(data.members) ? data.members : [];
  data.dateExpires = !isEmpty(data.dateExpires) ? data.dateExpires : '';

  if(!Validator.isLength(data.name, {min: 2, max: 30 }))  {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if(Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if(data.owners.length == 0) {
    errors.owners = 'At least one owner is required';
  }

  // if(data.members.length == 0) {
  //   errors.members = 'At least one member is required';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
