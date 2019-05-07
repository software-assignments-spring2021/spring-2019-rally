import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
//import isEmpty from '../../validation/is-empty';

import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';

class RallyItem extends Component {

  constructor(props) {
        super(props);

        this.state = {

            //put anything you want to keep track of here
            //examples------------------
            //stateVariable: '',
            //stateVariable: [],
            //stateVariable: new Date()
        }

        // any function you use this.setState() or
        // this.state.variable in has to have a line like this
        this.crossCompare = this.crossCompare.bind(this);
        // this.onChange = this.onChange.bind(this); <-- these might be useful
        // this.onSubmit = this.onSubmit.bind(this); <--
        // this.componentDidMount = this.componentDidMount.bind(this); <--

  }

  crossCompare(){

     console.log("xcompare: ",this.props.rally.rallies);

     // EXAMPLES -----------------------------------------
     // DO ANY POSTING OR GETTING LIKE THIS
     const data = {
         //variable : value
         id: this.props.rally._id
         // "variable" should be the name that you
         // try to access from req.body in the Router request
         // do this for all variables you access from req.body
     }
     axios
       .post('/api/rally/crossCompare', data)
       .then( res => {
         console.log("xcompare res: ",res.data)
       })
       .catch( err => {
           console.log(err)
       })
     ;

     // DO ANY STATE SETTING LIKE THIS
     // can be used in callback with "res"
     this.setState({

         //stateVariable: VAL

     });
 }


  render() {

    //TODO: change "border-info" in div to "border-primary" based on
    //      Rally ownership
    const { rally } = this.props;
    //console.log("rally item props", rally.timeSlot);
    let topTimes
    if(rally && rally.timeSlot){

        if(Object.keys(rally.timeSlot).length > 0){
            let timeSlotArr = [];
            //console.log("timeslot", timeSlotArr);

            Object.keys(rally.timeSlot).forEach(function(key) {
              timeSlotArr.push(key);
            });
            //console.log("TSArr",timeSlotArr)

            topTimes = (
                <div>
                    {timeSlotArr.slice(2,7).map((person, index) => (
                      <li key={index} className="list-group-item">
                        {moment(person).format('LLL')}
                      </li>
                    ))}
                </div>
            )
        }else{
            topTimes = <li className="list-group-item"><h5><i>Members of this Rally have not synced their Google calendars.</i></h5></li>
        }
    }
    let locationPoll;
    if(rally && rally.voting){
        if(Object.keys(rally.voting.locations).length > 0){

            let locArr = [];
            Object.keys(rally.voting.locations).forEach(function(key) {
              locArr.push({location: key, votes:rally.voting.locations[key]});
            });
            //console.log("locArr", locArr);
            locationPoll = (
                <div>
                    {locArr.slice().map((key, index) => (


                            <li key={index.votes} className="list-group-item">

                                <font className="text-muted">{key.location}</font>

                            <span style = {{marginLeft: 10}} className="badge badge-light">{key.votes}</span>
                            </li>
                    ))}
                </div>
            );
        }else{
            locationPoll = <li className="list-group-item"><i><h5>Nobody has suggested a location yet. Click View Rally to suggest and vote!</h5></i></li>
        }
    }

    return (
      <div>
        <div className="card border-info card-body bg-light mb-3 max-width: 18rem">
          <div className="row">
            <div className="col-md-10 d-md-block">
              <h2>{rally.name}</h2>
            </div>
            <div className="col-md-2 d-md-block">
              <Link to={{
                  state: {...this.state},
                  pathname:`myrally/${rally._id}`
              }}
              className="btn btn-info" onClick={this.crossCompare}>
                View Rally
              </Link>
            </div>
          </div>

          <div className="row">
              <div className="col-md-3 d-md-block">
                  <h5>Members</h5>

                  {rally.ownerNames.slice().map((person, index) => (
                    <li key={index} className="list-group-item">
                      {person}
                    </li>
                  ))}
              </div>

              <div className="col-md-5 d-md-block">
                  <h5>Date/Time Leaderboard</h5>
                  {topTimes}

              </div>

              <div className="col-md-4 d-md-block">
                  <h5>Location</h5>
                  {locationPoll}
              </div>
          </div>
        </div>
      </div>
    )
  }
}

RallyItem.propTypes = {
  rally: PropTypes.object.isRequired
}
const mapStateToProps = state => ({

  rally: state.rally,

})
export default (RallyItem);
