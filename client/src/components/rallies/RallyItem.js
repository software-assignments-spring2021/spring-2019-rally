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

            topTimeslots: {}
        }

        this.crossCompare = this.crossCompare.bind(this);
        // this.onChange = this.onChange.bind(this); <-- these might be useful
        // this.onSubmit = this.onSubmit.bind(this); <--
        // this.componentDidMount = this.componentDidMount.bind(this); <--
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

  }
  componentWillReceiveProps(nextProps){
      this.setState({
          rally: nextProps.rally
      })
  }

  crossCompare(){

     console.log("xcompare: ",this.props.rally.rallies);

     const data = {
         id: this.props.rally._id
     }
     const data2 = {
         _id: this.props.rally._id
     }
     axios
       .post('/api/rally/crossCompare', data)
       .then( res => {
         //console.log("xcompare res: ",res.data)
         axios
             .post(`/api/rally/returnCompare`, data2)
             .then(res =>
                 console.log("res in gettimeslots", res.data),
                 // this.setState({
                 //     topTimeslots:res.data
                 // })
             )
             .catch(err =>
                 console.log(err)
         );
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
 componentDidMount(){
     const { rally } = this.props;
     console.log("rally did mount",rally)
     if(this.props.rally){

             console.log("rallyID: ", this.props.rally._id);

             let data = {
                 _id: this.props.rally._id
             }
             axios
                 .post(`/api/rally/returnCompare`, data)
                 .then(res =>
                     //console.log("res in gettimeslots", res.data),
                     this.setState({
                         topTimeslots:res.data
                     })
                 )
                 .catch(err =>
                     console.log(err)
             );

     }else{return;}
 }


  render() {

    //TODO: change "border-info" in div to "border-primary" based on
    //      Rally ownership
    const { rally } = this.props;
    const {topTimeslots} = this.state;
    console.log("rally in render: ",rally)
    //let result = {};
    //result = this.findTopTimeSlots(rally.id);


    console.log("top timeSlot", topTimeslots);
    let topTimes
    if(topTimeslots){

        if(Object.keys(topTimeslots).length > 0){
            let timeSlotArr = [];
            //console.log("timeslot", timeSlotArr);

            Object.keys(topTimeslots).forEach(function(key) {
              timeSlotArr.push(topTimeslots[key]);
            });
            //console.log("TSArr",timeSlotArr)

            topTimes = (
                <div>
                    {timeSlotArr.slice(0,5).map((person, index) => (
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
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>

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
          <hr/>

          <div className="row">
              <div className="col-md-3 d-md-block">
                  <h5 style = {{marginLeft: 5}}><i className="far fa-user" style = {{marginRight: 10}}></i>Members</h5>

                  {rally.memberNames.slice().map((person, index) => (
                    <li key={index} className="list-group-item">
                      {person}
                    </li>
                  ))}
              </div>

              <div className="col-md-5 d-md-block">
              <h5 style = {{marginLeft: 5}}><i className="far fa-clock" style = {{marginRight: 10}}></i>Date/Time Leaderboard</h5>

                  {topTimes}

              </div>

              <div className="col-md-4 d-md-block">

                  <h5 style = {{marginLeft: 5}}><i className="fas fa-map-marker-alt" style = {{marginRight: 10}}></i>Location Poll</h5>

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
  topTimeslots: state.topTimeslots
})
export default (RallyItem);
