import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

//import { google } from 'googleapis';
import axios from 'axios';

class DeleteAccount extends Component {


    constructor(props) {
        super(props);
        this.deleteUser = this.deleteUser.bind(this);
    }

    deleteUser(){

        const data = {
            id: this.props.auth.user.id
        }
        axios
            .post('api/users/deleteAccount', data)
            .then (res => this.props.history.push('/'))
            .catch(err =>
                console.log(err)
            );
    }

    render(){
        console.log(this.props.auth);
        const {user} = this.props.auth;
        return(
            <div>
                <h2 className="display-4">Account Information</h2>
                <div className="card card-body bg-light mb-12">
                    <div className="col-md-6">
                        <div className="row"><h5>Name: {user.name}</h5></div>
                        <div className="row"><h5>Email: TO DO</h5></div>
                        <div className="row"><h5>Google Synced: TO DO</h5></div>
                    </div>
                </div>
                <br></br>
                <div onClick={this.deleteUser} className="btn btn-xs btn-danger">Delete Account</div><p></p>
                <small>You cannot undo this!</small>
                <p>TODO: revoke JWT when delete user is clicked</p>
            </div>
        );
    }

}


DeleteAccount.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(DeleteAccount);
