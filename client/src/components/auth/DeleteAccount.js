import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { DELETE_ACCOUNT} from '../../actions/types';
import { logoutUser } from '../../actions/authActions';

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
            .then ( res => {

                //dispatch logout option
                // dispatch({
                //     type: DELETE_ACCOUNT,
                //     payload: {}
                // }).then( res => this.props.history.push('/'))
                // .catch(err => console.log(err));
                this.props.logoutUser();


            })
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

                <div className="card card-body bg-light mb-12 w-75">
                <div className="row">
                    <div className="col-md-3">
                        <div onClick={this.deleteUser} className="btn btn-xs btn-danger">Delete Account</div>
                        <small className="form-text text-muted" border="5">You cannot undo this!</small>
                    </div>
                    <div className="col-md-9">
                    Deleting your account will also delete your data from all Rallies you are part of. This cannot be undone.

                    </div>
                </div>
                </div>


            </div>
        );
    }

}


DeleteAccount.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, {logoutUser})(DeleteAccount);
