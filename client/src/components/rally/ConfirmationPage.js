import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
//import isEmpty from '../../validation/is-empty';

import axios from 'axios';
import { connect } from 'react-redux';
import SelectListGroup from '../common/SelectListGroup';
import { confirmDetails } from '../../actions/profileActions';

class ConfirmationPage extends Component {

  constructor(props) {
        super(props);

        this.state = {
            timeSelection: '',
            locSelection: '',
            errors: {},
            rally: null
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);

  }
  componentWillReceiveProps(nextProps){

  }

  componentDidMount(){

  }
  onChange(e){
      this.setState({[e.target.name]: e.target.value})
  }
  onSubmit(e){
      e.preventDefault();

      console.log("in on submit",this.props.rally.rallies._id)
      let data = {
          id: this.props.rally.rallies._id,
          confirmed: {
              date: this.state.timeSelection,
              time: this.state.timeSelection,
              location: this.state.locSelection
          }
      }
      this.props.confirmDetails( data, this.props.history);

      //make call to confirm route
  }

  render() {



    //const { rally } = this.props;
    console.log("rally in confirm",this.props)
    const timeOptions = [];
    timeOptions.push({label: 'Confirm time slot', value: 0})
    if(this.props.rally && this.props.rally.rallies){
        const {timeSlot} = this.props.rally.rallies;
        Object.keys(timeSlot).forEach(function(key) {
          timeOptions.push({label: key, value: key});
        });
    }

    const locOptions = [
        {label: 'Confirm Location', value: 0},
        {label: '15 minutes', value: .25},
        {label: '30 minutes', value: '.5'},
    ];
    //let name;

    return (
        <div>

        <h1 className="display-4 text-center">Confirm Rally Details</h1>
        <br></br>
        <div className="row" >


          <div className="col-md-6">
            <div className="well">
              <div className="card card-body bg-light mb-3 mx-auto">
                <h3 className="display-6 text-center">Confirm Time slot</h3>
                <SelectListGroup
                    placeholder="Confirmed Timeslot"
                    name="timeSelection"
                    value={this.state.timeSelection}
                    onChange={this.onChange}

                    options={timeOptions}
                    info="This time will be displayed to all members upon submission."
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="well">
              <div className="card card-body bg-light mb-3 mx-auto">
                <h3 className="display-6 text-center">Confirm Location</h3>
                <SelectListGroup
                    placeholder="Confirmed Location"
                    name="locSelection"
                    value={this.state.locSelection}
                    onChange={this.onChange}

                    options={locOptions}
                    info="This location will be displayed to all members upon submission."
                />
              </div>
            </div>
          </div>
</div>
<div className = "row">
          <div className="col-md-12">
            <div className="well">
              <div className="card card-body bg-light mb-3">
                  <button type="button" onClick={this.onSubmit} className="btn btn-info">
                    <span>Confirm Details</span>
                  </button>
              </div>
            </div>
          </div>


        </div>

        </div>
    )
  }
}

ConfirmationPage.propTypes = {
  rally: PropTypes.object.isRequired,
  confirmDetails: PropTypes.func.isRequired
}
const mapStateToProps = state => ({

  rally: state.rally,

})
export default connect(mapStateToProps, {confirmDetails})(ConfirmationPage);
