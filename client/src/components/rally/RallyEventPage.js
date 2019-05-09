import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRallyByID, clearCurrentProfile, addLocations, /*getTimeslots,*/ addMembers } from '../../actions/profileActions';
import { Link } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class RallyEventPage extends Component {

  constructor(props) {
      super(props);

      //component state: rally form fields
      this.state = {

        // Location suggestion state fields
        locationSuggestion: '',
        pollAnswers: [],
        pollAnswerMap: new Map(),
        // Member addition fields

        addMembers: '',

        incomingVoting: null,
        topTimeslots: {},
        rally: null,
        hasVoted: false,

        errors: {}
      }

      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.handleVote = this.handleVote.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.onMembersSubmit = this.onMembersSubmit.bind(this);
      this.onMembersChange = this.onMembersChange.bind(this);
      this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
      this.deleteRally = this.deleteRally.bind(this);
  }

  // Used for location submission
  onChange(e){
      this.setState({[e.target.name]: e.target.value});

      // Debug location suggesting
      //console.log("location val: ",this.state.locationSuggestion);
  }

  onSubmit(e) {
      e.preventDefault();

      const {locationSuggestion, pollAnswers} = this.state;
      //console.log("submitting: ", locationSuggestion);

      const toAdd = {
          locations: locationSuggestion,
          _id: this.props.rally.rallies._id
      }

      axios
          .post('/api/rally/addLocations', toAdd)
          .then(res => {
              // this.setState({
              //   pollAnswers: newPollAnswers
              // })
              window.location.reload()
              // console.log(res)
              // history.push('/rally')
          })
          .catch(err => {
              console.log(err)
      });
  }

  onMembersChange(e){

    this.setState({
      addMembers: e.target.value
    })
    //console.log("member entered: ",this.state.addMembers)
  }

  onMembersSubmit(e){

    e.preventDefault();

    const {rallies}=this.props.rally;
    //console.log("rallies: ",rallies)

    //an array that keeps track of members that were added
    const {addMembers} = this.state;
    //console.log("adding member: ", addMembers);

    const data = {
      email: addMembers,
      _id: rallies._id
    }

    this.props.addMembers(data, this.props.history);
  }

  componentWillUnmount() {
   this._ismounted = false;
  }

  componentWillReceiveProps(nextProps){

      if(nextProps.errors){
          this.setState({errors: nextProps.errors});
      }
      //console.log("nextProps:", nextProps)
      if(nextProps.rally && !nextProps.rally.loading){
          if(nextProps.rally.rallies){
              const { voting, timeSlot } = nextProps.rally.rallies;
              const { hasVoted } = nextProps;
              //console.log("timeSlot obj: ",timeSlot)
              this.setState({

                  //topTimeslots: timeSlot,
                  rally: nextProps.rally,
                  hasVoted: hasVoted
              })
              if(voting){
                  this.setState({
                      incomingVoting: voting.locations,

                  })
              }
          }
      }
  }

  // Handling user vote
  // Increments the votes count of answer when the user votes
  handleVote(voteAnswer){

    const { hasVoted, errors } = this.state;
    // console.log("has voted props", this.props.hasVoted)
    // console.log("has voted state", hasVoted)
    if(hasVoted){
        console.log("Already voted!")
    }else{
        console.log("Have not voted yet, approved")
    }

    console.log("voteAnswer: ",voteAnswer); // this is an array of {location, vote} pairs
    const data = {
        location: voteAnswer,
        hasVoted: hasVoted,
        _id: this.props.rally.rallies._id
    }
    axios
        .post('/api/rally/addVotes', data)
        .then(res => {
            this.setState({
                hasVoted: true
            })
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
         }
     );
  }

  deleteRally(){
      const {rallies} = this.props.rally;
      if(rallies){
          let data = {
              id: this.props.rally.rallies._id
          }

          axios
            .post('/api/rally/deleteRally', data)
            .then(res => {
                this.props.history.push('/rally')
            })
            .catch(err => {
                console.log(err)
            })
      }

  }

  componentDidMount(){

    this.props.clearCurrentProfile();
    this.state.pollAnswers.push({option: 'Suggest locations below!', votes: 0});
    //console.log("rally params: ",this.props.match.params);
    if(this.props.match.params.rallyID){
            this.props.getRallyByID(this.props.match.params.rallyID);
            console.log("rallyID: ", this.props.match.params.rallyID);

            let data = {
                _id: this.props.match.params.rallyID
            }
            //this.props.getTimeslots(data, this.props.history);

            // axios
            //     .post(`/api/rally/returnCompare`, data)
            //     .then(res =>
            //         //console.log("res in getmeslots", res.data),
            //         this.setState({
            //             topTimeslots:res.data
            //         })
            //         // dispatch({
            //         //     type: GET_TIMES,
            //         //     payload: res
            //         // })
            //
            //     )
            //     .catch(err =>
            //         console.log(err)
            // );

    }else{return;}
  }

  render() {

    const {loading} = this.props.rally;

    console.log("RALLY",this.props.rally)
    //console.log("userid: ",this.props.auth.user.id)
    //console.log("rally in eventpage render", this.props.rally);

    const {incomingVoting, topTimeslots} = this.state;

    //console.log("topTimeslots from state", topTimeslots)
    const {id} = this.props.auth.user;
    console.log("logged in user id:", id)
    let ownerCog;
    if(!loading && this.props.rally && this.props.rally.rallies && this.props.rally.rallies.members){
        const {owners} = this.props.rally.rallies;
        //console.log("members len: ",members.length)
        for(let i = 0; i < owners.length; i++){

            //console.log("mem id: ", members[i], "userid:",id)
            if(owners[i] == id){
                //console.log("link state", this.state);
                ownerCog = (

                    <div className="btn-group mr-2" role="group" aria-label="First group">

                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>

                        <Link to={{
                            state: {...this.state},
                            pathname:`/myrally/${this.props.rally.rallies._id}/confirm`}}
                            className="btn btn-outline-info" >
                            <i style={{marginRight: 10 }} className="fas fa-tasks"></i>
                            Confirm Rally
                        </Link>
                        <button
                            className="btn btn-outline-danger" data-toggle="modal" data-target="#deleteModal">

                            <i style={{marginRight: 10 }} className="far fa-file-excel"></i>
                            Delete
                        </button>
                        <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Are you sure you want to delete this Rally?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                This cannot be undone.
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-info" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.deleteRally}>Delete Rally</button>
                              </div>
                            </div>
                          </div>
                        </div>

                    </div>

                );
                break;
            }
        }
    }

    let topTimes;
    let noConflicts = [];
    if(this.props.rally && this.props.rally.rallies){
        const {timeSlot} = this.props.rally.rallies;

        if(timeSlot){
            //console.log("timeslot object", timeSlot)
            Object.keys(timeSlot).forEach(function(key) {
                //console.log("time key:",key);
                //console.log("time val:",timeSlot[key]);
              //console.log("key type",typeof timeSlot[key]);
              if(timeSlot[key] === 0){
                  //console.log("key was 0")
                  noConflicts.push(key);
              }

            });
            console.log("no conflict arr", noConflicts);
            topTimes = (
                <div>


                    {noConflicts.slice(0,5).map((key, index) => (
                        <li key={index} className="list-group-item">
                            <small className="text-muted">{moment(key).format("LLL")}</small>
                        </li>
                    ))}


                </div>
            )
        }
    }

    // if(topTimeslots){
    //     //console.log("ifTopTimeslots", topTimeslots)
    //     let times = [];
    //     Object.keys(topTimeslots).forEach(function(key) {
    //       //console.log("time entry:",key, topTimeslots[key]);
    //         times.push(topTimeslots[key]);
    //     });
    //     //console.log("times array", times);
    //     topTimes = (
    //         <div>
    //
    //
    //             {times.slice(0,5).map((key, index) => (
    //                 <li key={index} className="list-group-item">
    //                     <small className="text-muted">{moment(key).format("LLL")}</small>
    //                 </li>
    //             ))}
    //
    //
    //         </div>
    //     )
    // }else{}

    let voting;
    if(incomingVoting){

        let locationPoll = [];
        Object.keys(incomingVoting).forEach(function(key) {
          //console.log("loc entry:",key, incomingVoting[key]);
          locationPoll.push({location: key, votes:incomingVoting[key]});

        });
        //console.log("location poll",locationPoll);

        voting = (
            <div>
                {locationPoll.slice().map((key, index) => (


                        <li key={index.votes} className="list-group-item">
                        <button type="button" onClick={() => this.handleVote(key.location)}>
                            <font className="text-muted">{key.location}</font>
                        </button>
                        <span style = {{marginLeft: 10}} className="badge badge-light">{key.votes}</span>
                        </li>
                ))}
            </div>
        );



    }else{
        voting = <h5>No locations have been suggested yet. Add a location below!</h5>
    }


    const {errors} = this.state;
    let err = errors.email;
    console.log("errors.email",errors.email)

    if( this.props.rally.rallies === null || loading ) {
      pageData = <h4>Loading...</h4>
    }else{

    }
    let pageData;
    if(this.props.rally.rallies && this.props.match.params.rallyID){

      // Display restrictions if they exist
      let restrictions;
      let restrictionData;
      if(this.props.rally.rallies.restrictions){

          restrictions = this.props.rally.rallies.restrictions;

          Object.keys(restrictions).map(function(key, index) {
            //console.log(restrictions[key], key);
          });

          restrictionData = (
            <div>
              <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>

              {restrictions.location ? <div><p>Predetermined Location: <b>{restrictions.location}</b></p></div> : null}

              {restrictions.startDate ? <div>
                  <div className="row">
                    <div className="col-md-1">
                      <i className="far fa-calendar-check"></i>
                    </div>
                    <div className="col-md-10">
                      <p>Date Range Start: <br/><b>{moment(restrictions.startDate).format('MM-DD-YYYY')}</b></p>
                    </div>
                  </div>
              </div> : null}

              {restrictions.endDate ? <div>
                  <div className="row">
                    <div className="col-md-1">
                      <i className="far fa-calendar-check"></i>
                    </div>
                    <div className="col-md-10">
                      <p>Date Range End: <br/><b>{moment(restrictions.endDate).format('MM-DD-YYYY')}</b></p>
                    </div>
                  </div>
              </div> : null}

              {restrictions.earliestTime ?
                <div>
                  <div className="row">
                    <div className="col-md-1">
                      <i className="far fa-clock"></i>
                    </div>
                    <div className="col-md-10">
                      <p>Earliest Start Time: <br/><b>{moment(restrictions.earliestTime).format('LT')}</b></p>
                    </div>
                  </div>
                </div> : null}

              {restrictions.latestTime ?
              <div>
                  <div className="row">
                    <div className="col-md-1">
                      <i className="far fa-clock"></i>
                    </div>
                    <div className="col-md-10">
                      <p>Latest End Time: <br/><b>{moment(restrictions.latestTime).format('LT')}</b></p>
                    </div>
                  </div>

              </div> : null}

              {restrictions.timeOfWeek ?
              <div className="row">
                  <div className="col-md-1">
                    <i className="far fa-times-circle"></i>
                  </div>
                  <div className="col-md-10">
                    <p>Only schedule on: <br/><b>{restrictions.timeOfWeek}</b></p>
                  </div>


              </div> : null}
            </div>
          )
      }else{ restrictionData = <h6>No restrictions set. Take the reigns!</h6>;}



      pageData = (

        <div>
          <h1 className="display-4">{this.props.rally.rallies.name}</h1>

          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>


            {this.props.rally.rallies.owners ?
                <div>
                  <div className="row">
                    <div className="col-md-8">
                      <h3 className="text-muted" style={{marginLeft: 10}}>Organizer: {this.props.rally.rallies.ownerNames.slice().map((key, index) => (
                        <font >{key} </font>
                    ))} </h3>

                    </div>
                    <div className="col-md-4">
                        {ownerCog}
                    </div>
                  </div>
                </div> : <h6>no owner array</h6>}



          <div className="row">



            <div className="col-md-3">
              <div className="well">
                <div className="card card-body bg-light mb-3">
                  <h3>Details</h3>
                  <h5>Duration: ~ {this.props.rally.rallies.duration} hour(s)</h5>
                  These are the scheduling details and restrictions we have from you so far.<hr/>
                  <h5>Restrictions:</h5>
                  {restrictionData}
                </div>
                <div className="container">
                    <center><h3>Thank you for using Rally! <p/>Visit our Github to learn more!</h3><p/>
                    <i className="far fa-calendar-check fa-10x" style={{color:'#2A9DA9'}}></i></center>
                </div>
              </div>
            </div>


            <div className="col-md-8">

            <div className="row">
            <div className="col-md-12 h-100">
              <div className="well">
                <div className="card card-body bg-light mb-3">
                <h3>Best Time Slots:</h3>
                <div>The times below maximize attendance of the Rally members.</div>
                <br/>
                {topTimes ?
                <div>
                  {topTimes}
                </div> : <div><h5>None of this Rally's members have synced their Google calendar yet.</h5></div> }


                </div>
                </div>
                </div>
            </div>



              <div className="row">

                <div className="col-md-6 d-flex align-items-stretch">
                  <div className="well">
                    <div className="card card-body bg-light mb-3 h-100">
                      <h3>Location Voting</h3>
                      <p>Vote on a location or suggest your own!<br/><small className="text-muted">Click a location to cast your vote!</small></p>

                      {voting}
                      <br></br>
                      <TextFieldGroup
                                placeholder="Location suggestion"
                                name="locationSuggestion"
                                type="locationSuggestion"
                                value={this.state.locationSuggestion}
                                onChange={this.onChange}
                                info="If you do not see an option you like, submit a suggestion then vote on it in the poll above!"
                      />

                      <button type="button" onClick={this.onSubmit} className="btn btn-info">
                        <span>Submit Suggestion</span>
                      </button>

                    </div>
                  </div>
                </div>


                <div className="col-md-6 d-flex align-items-stretch">
                  <div className="well">
                    <div className="card card-body bg-light mb-3 h-100">
                      <h3>Members</h3>
                      <p fontSize="20px">Those who can attend the number one time slot are italicized.</p>




                      {this.props.rally.rallies.memberNames
                          ? <div>
                          {this.props.rally.rallies.memberNames.slice().map((person, index) => (
                            <li key={index} className="list-group-item">
                              <font className="text-muted">{person}</font>
                            </li>
                          ))}
                          </div> : <h6>no member array</h6>}
                      <br></br>

                      <TextFieldGroup
                                placeholder="Add members by email"
                                name="addMembers"
                                type="addMembers"
                                value={this.state.addMembers}
                                onChange={this.onMembersChange}
                                info="Enter email of member you want to add"
                                error={err}
                      />

                      <button type="button" onClick={this.onMembersSubmit} className="btn btn-info">
                        <span>Invite</span>
                      </button>

                    </div>
                  </div>
                </div>



              </div>


            </div>
          </div>
        </div>
      )
      //const { duration, name, members, owners, restrictions } = rallies;
    }else{
      pageData = null
    }


    let confirmedState;

    if(this.props.rally && this.props.rally.rallies){
        //const {confirmed} = this.props.rally.rallies;
        //console.log("check:",this.props.rally.rallies.confirmed);
        if(this.props.rally.rallies.confirmed){
            const { date, time, location } = this.props.rally.rallies.confirmed;
            console.log("confirmations:", date, time, location)
            //------
            confirmedState = (

                <div>
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>

                    <h1 className="display-4">{this.props.rally.rallies.name}</h1>
                    {this.props.rally.rallies.owners ?
                    <h5 className="text-muted" style={{marginLeft: 5}}>Organizers:
                        {this.props.rally.rallies.ownerNames.slice().map((key, index) => (
                            <font >{key} </font>
                        ))}
                        </h5> : <h6>no owner array</h6>
                    }

                    <div className="row">
                        <div className="col-md-6">
                            <div className="card card-body bg-light mb-3">
                                <h3>Confirmed Details</h3>
                                <h5>Duration: ~ {this.props.rally.rallies.duration} hour(s)</h5>
                                <p>These are the scheduling details confirmed by the organizer.</p>
                                <div className="hr"/>
                                <br></br>
                                <h5> <i className="far fa-calendar-check" style={{marginRight: 10}}></i>Date: {moment(date).format('LL')}</h5>
                                <h5><i className="far fa-clock" style={{marginRight: 10}}></i>Time: {moment(time).format('LT')}</h5>
                                <h5><i className="fas fa-map-marker-alt" style={{marginRight: 10}}></i>Location: {location}</h5>

                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card card-body bg-light mb-3">
                                <h3>Members</h3>

                                {this.props.rally.rallies.memberNames ?
                                <div>
                                    {this.props.rally.rallies.memberNames.slice().map((person, index) => (
                                    <li key={index} className="list-group-item">
                                        <small className="text-muted">{person}</small>
                                    </li>
                                    ))}
                                </div> : <h6>no member array</h6>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-md-4">
                        <button
                            className="btn btn-outline-danger" data-toggle="modal" data-target="#deleteModal">

                            <i style={{marginRight: 10 }} className="far fa-file-excel"></i>
                            Delete Rally
                        </button>
                        <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Are you sure you want to delete this Rally?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                This cannot be undone.
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-info" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.deleteRally}>Delete Rally</button>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                </div>
            )
            //-------
            if(date !== null && time !== null && location !== null){
                pageData = confirmedState;
            }

        }
    }



    return (
      <div className="rallies">
          {pageData}
      </div>
    );
  }
}

RallyEventPage.propTypes = {
  getRallyByID: PropTypes.func.isRequired,
  clearCurrentProfile: PropTypes.func.isRequired,
  getTimeslots: PropTypes.func.isRequired,
  rally: PropTypes.object.isRequired,
  addMembers: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  hasVoted: PropTypes.bool
}

const mapStateToProps = state => ({

  rally: state.rally,
  errors: state.errors,
  //locationSuggestion: state.locationSuggestion,
  pollAnswers: state.pollAnswers,
  incomingVoting: state.incomingVoting,
  hasVoted: state.hasVoted,
  //topTimeslots: state.
  auth: state.auth,
  errors: state.errors
})

// connects the props of the state returned from getRallyByID
// and those in the component, then exports the component
// with these props and state
export default connect(mapStateToProps, {getRallyByID, /*getTimeslots,*/ addMembers, addLocations, clearCurrentProfile})(withRouter(RallyEventPage));
