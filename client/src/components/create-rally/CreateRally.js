import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';


class CreateRally extends Component {

    constructor(props) {
        super(props);

        //component state: rally form fields
        this.state = {
            displayRestrictions: false,
            rallyName: '',
            duration: '',
            //TODO: remove later
            members: '',
            owners: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();

        console.log("submit");
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        const {errors} = this.state;

        // duration selection options
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
                                    value={this.state.rallyName}
                                    onChange={this.onChange}
                                    error={errors.rallyName}
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
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

CreateRally.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps)(CreateRally);
