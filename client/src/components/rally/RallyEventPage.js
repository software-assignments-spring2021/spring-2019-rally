import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRallyByID, clearCurrentProfile, addLocations } from '../../actions/profileActions';
import { Link } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import axios from "axios";
import Poll from 'react-polls';

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
        // one member's email
        addMembers: " ",
        errors: {}
      }

      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.handleVote = this.handleVote.bind(this);
      this.onMembersSubmit = this.onMembersSubmit.bind(this);
      this.onMembersChange = this.onMembersChange.bind(this);
  }

  // Used for location submission
  onChange(e){
      this.setState({[e.target.name]: e.target.value});

      // Debug location suggesting
      console.log("location val: ",this.state.locationSuggestion);
  }

  onSubmit(e) {
      e.preventDefault();

      const {locationSuggestion, pollAnswers} = this.state;
      //console.log("submitting: ", locationSuggestion);

      const toAdd = {
          locations: locationSuggestion,
          _id: this.props.rally.rallies._id
      }

      console.log("addLoc.loc: ",toAdd.locations);
      console.log("addLoc.id: ",toAdd._id);

      this.props.addLocations(toAdd, this.props.history);
      //this.state.pollAnswers.push({ option: {locationSuggestion}, votes: 0});
      //console.log("poll answers on sub: ",pollAnswers);



  }

  onMembersChange(e){

    this.setState({
      addMembers: e.target.value
    })
    console.log("member entered: ",this.state.addMembers)
  }

  onMembersSubmit(e){

    e.preventDefault();

    const {rallies}=this.props.rally;
    console.log("rallies: ",rallies)

    //an array that keeps track of members that were added
    const {addMembers} = this.state;
    // console.log("adding member: ", addMembers);

    const data = {
      email: addMembers,
      _id: rallies._id
    }

    //create axios request to post request with email in a string to add to the rally object in the database
    axios
      .post('/api/rally/addMembers', data)
      .then( res => {
        // console.log(res);
      })
      .catch(err => 
        console.log(err)
      );
  }

  componentWillUnmount() {
   this._ismounted = false;
  }

  componentWillReceiveProps(nextProps){

      if(nextProps.errors){
          this.setState({errors: nextProps.errors});
      }
      console.log("nextProps:", nextProps)
  }

  // Handling user vote
  // Increments the votes count of answer when the user votes
  handleVote = voteAnswer => {


    const { pollAnswers } = this.state;
    console.log("poll answers: ",pollAnswers);

    //iterate through locations and increment vote count where necessary
    const newPollAnswers = pollAnswers.map(answer => {
      if (answer.option === voteAnswer) answer.votes++
      return answer
    })

    // set the poll answers to be the updated info
    this.setState({
      pollAnswers: newPollAnswers
    })

  }

  componentDidMount(){

    this.props.clearCurrentProfile();
    this.state.pollAnswers.push({option: 'Suggest locations below!', votes: 0});

    console.log("rally params: ",this.props.match.params);
    if(this.props.match.params.rallyID){
        if(this.props.match.params.rallyID !== "rally"){
            this.props.getRallyByID(this.props.match.params.rallyID);
            console.log("rallyID: ", this.props.match.params.rallyID);
        }


    }else{return;}

    if(!this.props.rally.loading){

        // const newPollAnswers = pollAnswers.map(answer => {
        //   if (answer.option === voteAnswer) answer.votes++
        //   return answer
        // })
        //console.log(this.props.rally.voting)
        if(this.props.rally.voting){
            let iterator = this.props.rally.rallies.voting.locations.entries();
            for(let value of iterator){
                console.log("iterator: ",value);

            }
            this.setState({
              pollAnswerMap: this.props.rally.rallies.voting.locations
            })
        }
    }

    //this.state.pollAnswerMap =
  }

  render() {

    const {loading} = this.props.rally;

    if( this.props.rally.rallies === null || loading ) {
      pageData = <h4>Loading...</h4>
    }else{

    }

    let pageData;

    // TODO: THIS IS NOT WORKING RIGHT NOW.. is this checking that the url id matches rally ID?
    if(this.props.rally.rallies && this.props.match.params.rallyID){

      // TODO:
      // 1. Implement checking whether user has already voted
      //    in order to determine which Voting card to display
      // 2. Location Poll Vote buttons link to backend + CREATE SCHEMA
      // 3. Backend for storing arrays from CSV entries for members
      // 4. Add Member button hooked to backend
      // 5. Displaying members names instead of IDs

      const pollQuestion = null;

      if(this.props.rally.rallies.voting){
          const {locations} = this.props.rally.rallies.voting;//.pollAnswers;
          // console.log("incheck: ", locations);
      }

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
                      <p>Date Range Start: <b>{moment(restrictions.startDate).format('MM-DD-YYYY')}</b></p>
                    </div>
                  </div>
              </div> : null}

              {restrictions.endDate ? <div>
                  <div className="row">
                    <div className="col-md-1">
                      <i className="far fa-calendar-check"></i>
                    </div>
                    <div className="col-md-10">
                      <p>Date Range End: <b>{moment(restrictions.endDate).format('MM-DD-YYYY')}</b></p>
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
                      <p>Earliest Start Time: <b>{moment(restrictions.earliestTime).format('HH:mm A')}</b></p>
                    </div>
                  </div>
                </div> : null}

              {restrictions.latestTime ? <div>
                  <div className="row">
                    <div className="col-md-1">
                      <i className="far fa-clock"></i>
                    </div>
                    <div className="col-md-10">
                      <p>Latest End Time: <b>{moment(restrictions.latestTime).format('HH:mm A')}</b></p>
                    </div>
                  </div>

              </div> : null}

              {restrictions.timeOfWeek ? <div><p>Only schedule on: <b>{restrictions.timeOfWeek}</b></p></div>:null}
            </div>
          )
      }else{ restrictionData = <h6>No restrictions set. Take the reigns!</h6>;}

      let votingAnswers;

      pageData = (

        <div>
          <h1 className="display-4">{this.props.rally.rallies.name}</h1>
          <div className="card card-body bg-light mb-12">

            {this.props.rally.rallies.owners ?
                <div>
                  <div className="row">
                    <div className="col-md-2">
                      <h5>Organizers</h5>
                    </div>

                    <div className="col-md-10">
                      {this.props.rally.rallies.owners.slice().map((key, index) => (
                        <small className="text-muted">{key}, </small>
                      ))}
                    </div>
                  </div>
                </div> : <h6>no owner array</h6>}
          </div>
          <br></br>

          <div className="row">

            <div className="col-md-4">
              <div className="well">
                <div className="card card-body bg-light mb-3">
                  <h3>Details</h3>
                  <h5>Duration: ~ {this.props.rally.rallies.duration} hour(s)</h5>
                  <p>These are the scheduling details and restrictions we have from you so far.</p>
                  <div className="hr"/>
                  <br></br>
                  <h5>Restrictions:</h5>

                  {restrictionData}

                </div>
              </div>
            </div>


            <div className="col-md-8">
              <div className="row">

                <div className="col-md-6">
                  <div className="well">
                    <div className="card card-body bg-light mb-3">
                      <h3>Location Voting</h3>
                      <p>Vote on a location or suggest your own!</p>

                      <Poll question='' answers={this.state.pollAnswers} onVote={this.handleVote} />

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


                <div className="col-md-6">
                  <div className="well">
                    <div className="card card-body bg-light mb-3">
                      <h3>Members</h3>
                      <p fontSize="20px">Those who can attend the number one time slot are italicized.</p>




                      {this.props.rally.rallies.members
                          ? <div>
                          {this.props.rally.rallies.members.slice().map((person, index) => (
                            <li key={index} className="list-group-item">
                              <small className="text-muted">{person}</small>
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
                                error={this.state.errors.email}
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
  //addLocations: PropTypes.func.isRequired,
  rally: PropTypes.object.isRequired,

  //locationSuggestion: PropTypes.object.isRequired,
  //pollAnswers: PropTypes.object.isRequired
  //auth: PropTypes.object.isRequired

}

const mapStateToProps = state => ({

  rally: state.rally,

  //locationSuggestion: state.locationSuggestion,
  //pollAnswers: state.pollAnswers

  //auth: state.auth
})

// connects the props of the state returned from getRallyByID
// and those in the component, then exports the component
// with these props and state
export default connect(mapStateToProps, {getRallyByID, addLocations, clearCurrentProfile})(withRouter(RallyEventPage));
