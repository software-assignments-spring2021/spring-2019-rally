import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRallies, clearCurrentProfile } from '../../actions/profileActions';
import { Link } from 'react-router-dom';

//import { google } from 'googleapis';


import RallyItem from './RallyItem';

const readline = require('readline');
//const fs = require('fs');
//const { google } = require('googleapis');


class Rallies extends Component {


  componentDidMount(){
    this.props.clearCurrentProfile();
    const { user } = this.props.auth;
    console.log(user.name);
    this.props.getRallies(user);

  }


  render() {


      // const readline = require('readline');
    //const { google } = require('googleapis');

    // const {client_secret, client_id, redirect_uris} = credentials.installed;
    // const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // const authUrl = oAuth2Client.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: SCOPES,
    // });
    //
    // console.log("authUrl: ",authUrl);

    //const { user } = this.props.auth;
    //console.log(this.props.rally);
    const { rallies, loading } = this.props.rally;
    let rallyItems;
    //const rallyIDs = [];

    //console.log(rallies);
    if( rallies === null || loading ) {
      rallyItems = <h4>Loading...</h4>
    }
    else{
        if(rallies.length > 0){


          rallyItems = rallies.map(rally => (
              <RallyItem key={rally._id} rally={rally}/>
          ));

        }else{
          //rallyItems = <h4>No Profiles Found</h4>
          rallyItems = (
            <div>
                <p className="lead text-muted">Welcome</p>
                <p>You do not have any Rallies to display. Try making one!</p>
            </div>
        )

    }
  }

    return (
      <div className="rallies">
        <div className="container">
          <div className ="row">
            <div className="col-md-12">
                <h1 className="display-4">My Rallies
                </h1>

                <p className="lead">
                <Link to="/create-rally" className="btn btn-xs btn-info">
                    Create a Rally
                </Link>
                </p>

                <p className="lead">


                <a href="https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&response_type=code&client_id=987401539137-ia5sndc9trs64phqig2ftluiqd8j4lnu.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Frally%2Fgoogle%2Fredirect">Sync</a>
                </p>

                {rallyItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Rallies.propTypes = {
  getRallies: PropTypes.func.isRequired,
  clearCurrentProfile: PropTypes.func.isRequired,
  rally: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
  //profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  //profile: state.profile,
  rally: state.rally,
  auth: state.auth
})

export default connect(mapStateToProps, {getRallies, clearCurrentProfile})(Rallies);
