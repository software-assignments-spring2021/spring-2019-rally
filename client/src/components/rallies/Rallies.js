import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRallies, clearCurrentProfile } from '../../actions/profileActions';
import { Link } from 'react-router-dom';

//import { google } from 'googleapis';
import axios from 'axios';

import RallyItem from './RallyItem';

const readline = require('readline');
//const fs = require('fs');
//const { google } = require('googleapis');


class Rallies extends Component {

    constructor(props) {
        super(props);

        this.state = {

          URL: '',
        }

        this.componentDidMount = this.componentDidMount.bind(this);


    }

  componentDidMount(){
    this.props.clearCurrentProfile();
    const { user } = this.props.auth;
    console.log(user.name);
    this.props.getRallies(user);


    axios.get('api/rally/google')
        .then(res =>

            this.setState({URL: res.data})
            //url = res.data

        )
        .catch(err =>
            console.log(err)
        );




  }

  render() {

      console.log("url: ", this.state.URL);
    const { rallies, loading } = this.props.rally;
    let rallyItems;

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


                <a href={this.state.URL} target="_blank" className="btn btn-xs btn-info">Sync My Google Calendar</a>
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
