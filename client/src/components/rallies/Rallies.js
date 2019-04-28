import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRallies, clearCurrentProfile } from '../../actions/profileActions';
import { Link } from 'react-router-dom';

//import { google } from 'googleapis';
import axios from 'axios';

import RallyItem from './RallyItem';

//const readline = require('readline');
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

      //console.log("url: ", this.state.URL);
    const { rallies, loading } = this.props.rally;
    let rallyItems;

    if( rallies === null || loading ) {
      rallyItems = <h4>Loading...</h4>
      if(rallies === null && !loading){
          rallyItems = <h4>Please refresh the page</h4>
      }
    }
    // if (rallies === null && !loading){
    //     rallyItems = <h4>Error loading Rallies. Please refresh the page.</h4>
    // }
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

                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>

                    <div className="btn-group mr-2" role="group" aria-label="First group">


                        <p className="lead">
                        <Link to="/create-rally" className="btn btn-xs btn-info">
                            <i style={{marginRight: 10 }} className="fas fa-plus"></i>
                            New Rally
                        </Link>
                        </p>

                    </div>
                    <div className="btn-group mr-2" role="group" aria-label="second group">
                        <p className="lead">
                        <a href={this.state.URL} target="_blank" className="btn btn-xs btn-info ">

                            <i style={{marginRight: 10 }} className="fab fa-google"></i>

                            Sync Google Calendar
                        </a>
                        </p>
                    </div>




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
