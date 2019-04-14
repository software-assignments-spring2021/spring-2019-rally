import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRallies } from '../../actions/profileActions';
import { Link } from 'react-router-dom';

import RallyItem from './RallyItem';

class Rallies extends Component {


  componentDidMount(){
    const { user } = this.props.auth;
    this.props.getRallies(user);
  }

  render() {
    //const { user } = this.props.auth;
    //console.log(this.props.rally);
    const { rallies, loading } = this.props.rally;
    let rallyItems;
    const rallyIDs = [];

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
  rally: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
  //profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  //profile: state.profile,
  rally: state.rally,
  auth: state.auth
})

export default connect(mapStateToProps, {getRallies})(Rallies);
