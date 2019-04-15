import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
//import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import { createRally, clearCurrentProfile } from '../../actions/profileActions';
import { withRouter } from 'react-router-dom';

//import moment from 'moment';

import DatePicker from 'react-datepicker';

import {datetimepicker} from 'datepicker-moment';
const picker = require('react-datepicker/dist/react-datepicker.css');

class CreateRally extends Component {

    constructor(props) {
        super(props);

        //component state: rally form fields
        this.state = {
            displayRestrictions: false,
            name: '',
            duration: '',
            members: [],
            owners: [],
            earliestTime: new Date(),
            latestTime: new Date(),
            location: '',
            locationSuggRadius: '',
            timeOfWeek: '',
            startDate: new Date(),
            endDate: new Date(),
            errors: {},
            date: new Date(),
            time: new Date()
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onEndChange = this.onEndChange.bind(this);
        this.onStartTimeChange = this.onStartTimeChange.bind(this);
        this.onEndTimeChange = this.onEndTimeChange.bind(this);


    }

    componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({errors: nextProps.errors});
        }
    }

    componentDidMount(){

      this.props.clearCurrentProfile();
    
      this.setState({
        earliestTime: null,
        latestTime: null,
        startDate: null,
        endDate: null
      });
    }

    onSubmit(e) {
        e.preventDefault();

        const rallyData = {

            //displayRestrictions: this.state.displayRestrictions,
            name: this.state.name,
            duration: this.state.duration,
            members: this.state.members,
            owners: this.state.owners,
            earliestTime: this.state.earliestTime,
            latestTime: this.state.latestTime,
            location: this.state.location,
            locationSuggRadius: this.state.locationSuggRadius,
            timeOfWeek: this.state.timeOfWeek,

            startDate: this.state.startDate,
            endDate: this.state.endDate,
            date: this.state.date
        }
        // call redux action for passing this rallyData into post
        this.props.createRally(rallyData, this.props.history);

    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    onStartChange(date) {
      this.setState({
        startDate: date
      })
    }

    onEndChange(date) {
      this.setState({
        endDate: date
      })
    }
    onStartTimeChange(time) {
      this.setState({
        earliestTime: time
      })
    }
    onEndTimeChange(time) {
      this.setState({
        latestTime: time
      })
    }

    render() {
        const {errors, displayRestrictions} = this.state;

        let restrictions;
        const options = [
            {label: 'Select event duration', value: 0},
            {label: '15 minutes', value: '.25'},
            {label: '30 minutes', value: '.5'},
            {label: '1 Hour', value: '1'},
            {label: '1.5 Hours', value: '1.5'},
            {label: '2 Hours', value: '2'},
            {label: '2.5 Hours', value: '2.5'},
            {label: '3 Hours', value: '3'},
            {label: '3.5 Hours', value: '3.5'},
            {label: '4 Hours', value: '4'},
            {label: '4.5 Hours', value: '4.5'},
            {label: '5 Hours', value: '5'},
            {label: 'Longer than 5 Hours', value: '5+'}
        ];

        const radiusOptions = [

            {label: 'Select location suggestion radius', value: 0},
            {label: '0.5 miles', value: 0.5},
            {label: '1 miles', value: 1},
            {label: '2 miles', value: 2},
            {label: '5 miles', value: 5},
            {label: '10 miles', value: 10},
            {label: '15 miles', value: 15},

        ];

        // const timeStartOptions = [
        //
        //     // TODO: separate drop down for AM/PM
        //     {label: 'Select start time restriction', value: 0},
        //     {label: '12 AM', value: '0'},
        //     {label: '1 AM', value: '1'},
        //     {label: '2 AM', value: '2'},
        //     {label: '3 AM', value: '3'},
        //     {label: '4 AM', value: '4'},
        //     {label: '5 AM', value: '5'},
        //     {label: '6 AM', value: '6'},
        //     {label: '7 AM', value: '7'},
        //     {label: '8 AM', value: '8'},
        //     {label: '9 AM', value: '9'},
        //     {label: '10 AM', value: '10'},
        //     {label: '11 AM', value: '11'},
        //     {label: '12 PM', value: '12'},
        //     {label: '1 PM', value: '13'},
        //     {label: '2 PM', value: '14'},
        //     {label: '3 PM', value: '15'},
        //     {label: '4 PM', value: '16'},
        //     {label: '5 PM', value: '17'},
        //     {label: '6 PM', value: '18'},
        //     {label: '7 PM', value: '19'},
        //     {label: '8 PM', value: '20'},
        //     {label: '9 PM', value: '21'},
        //     {label: '10 PM', value: '22'},
        //     {label: '11 PM', value: '23'},
        // ];
        // const timeEndOptions = [
        //
        //     // TODO: separate drop down for AM/PM
        //     {label: 'Select end time restriction', value: 0},
        //     {label: '12 AM', value: '0'},
        //     {label: '1 AM', value: '1'},
        //     {label: '2 AM', value: '2'},
        //     {label: '3 AM', value: '3'},
        //     {label: '4 AM', value: '4'},
        //     {label: '5 AM', value: '5'},
        //     {label: '6 AM', value: '6'},
        //     {label: '7 AM', value: '7'},
        //     {label: '8 AM', value: '8'},
        //     {label: '9 AM', value: '9'},
        //     {label: '10 AM', value: '10'},
        //     {label: '11 AM', value: '11'},
        //     {label: '12 PM', value: '12'},
        //     {label: '1 PM', value: '13'},
        //     {label: '2 PM', value: '14'},
        //     {label: '3 PM', value: '15'},
        //     {label: '4 PM', value: '16'},
        //     {label: '5 PM', value: '17'},
        //     {label: '6 PM', value: '18'},
        //     {label: '7 PM', value: '19'},
        //     {label: '8 PM', value: '20'},
        //     {label: '9 PM', value: '21'},
        //     {label: '10 PM', value: '22'},
        //     {label: '11 PM', value: '23'},
        // ];

        const onlyOptions = [
            {label: 'Only consider these days', value: 0},
            {label: 'Weekends', value: 'Weekends'},
            {label: 'Weekdays', value: 'Weekdays'},
        ];

        if(displayRestrictions){
            restrictions = (

                <div>

                  <TextFieldGroup
                      placeholder="Predetermined Location"
                      name="location"
                      type="location"
                      value={this.state.location}
                      onChange={this.onChange}
                      error={errors.location}
                      info="If the location is not up for voting, please add it here"
                  />
                  <SelectListGroup
                      placeholder="Location suggestion radius"
                      name="locationSuggRadius"
                      value={this.state.locationSuggRadius}
                      onChange={this.onChange}
                      error={errors.locationSuggRadius}
                      options={radiusOptions}
                      info="Rally members may only suggest event locations within X distance"
                  />

                  <SelectListGroup
                      placeholder="Only consider this part of the week when scheduling"
                      name="timeOfWeek"
                      value={this.state.timeOfWeek}
                      onChange={this.onChange}
                      error={errors.timeOfWeek}
                      options={onlyOptions}
                      info="Only consider this part of the week when scheduling this Rally"
                  />

                    <p className="lead text-muted">Date range selection</p>
                    <p></p>
                    <DatePicker
                        selected={this.state.startDate}
                        selectsStart
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.onStartChange}
                        name="startDate"
                        error={errors.startDate}
                        isClearable={true}
                        placeholderText="Click to select a date"
                    />

                    <DatePicker
                        selected={this.state.endDate}
                        selectsEnd
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.onEndChange}
                        name="endDate"
                        error={errors.endDate}
                        isClearable={true}
                        placeholderText="Click to select a date"
                    />
                    <p></p>
                    <p className="lead text-muted">Time restrictions</p>
                    <p></p>


                    <div className="column">
                        <DatePicker
                            selected={this.state.earliestTime}
                            onChange={this.onStartTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            dateFormat="h:mm aa"
                            timeCaption="Time"
                            name="earliestTime"
                            error={errors.earliestTime}
                            placeholderText="Select Time"
                            isClearable={true}
                        />
                        { <small className="form-text text-muted" border="20" >Set start time restriction</small>}
                        {errors.earliestTime && (<div className='invalid-feedback'>{errors.earliestTime}</div>)}
                        <p></p>
                    </div>

                    <div className="column">
                        <DatePicker
                            selected={this.state.latestTime}
                            onChange={this.onEndTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            dateFormat="h:mm aa"
                            timeCaption="Time"
                            name="startDate"
                            error={errors.latestTime}
                            placeholderText="Select Time"
                            isClearable={true}
                        />
                        { <small className="form-text text-muted" border="20" >Set end time restriction</small>}
                        {errors.startDate && (<div className='invalid-feedback'>{errors.latestTime}</div>)}
                        <p></p>
                    </div>

                </div>

            )
        }

        return (
            <div className="create-rally">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">
                                Create a Rally
                            </h1>
                            <p className="lead text-center">
                            Fill in the information below to get started! </p>
                            <small className="d-block pb-3">* = required fields</small>

                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    placeholder="Rally event title"
                                    name="name"
                                    type="name"
                                    value={this.state.name}
                                    onChange={this.onChange}
                                    error={errors.name}
                                    info="* This is the event name invited members will see"
                                />

                                <SelectListGroup
                                    placeholder="Event duration"
                                    name="duration"
                                    value={this.state.duration}
                                    onChange={this.onChange}
                                    error={errors.duration}
                                    options={options}
                                    info="* Give an approximation of the event length"
                                />

                                <div className="mb-3">
                                    <button type="button" onClick={() => {
                                        this.setState(prevState => ({
                                            displayRestrictions: !prevState.displayRestrictions,

                                        }))
                                    }} className="btn btn-light">
                                        Add Event Restrictions
                                    </button>
                                    <span className="text-muted">  Optional</span>
                                </div>
                                { restrictions }
                                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>
                            </form>

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

CreateRally.propTypes = {

    rally: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    clearCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({

    rally: state.rally,
    errors: state.errors
});

export default connect(mapStateToProps, { createRally, clearCurrentProfile })(withRouter(CreateRally));
