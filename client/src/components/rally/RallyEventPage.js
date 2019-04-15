import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRallyByID, clearCurrentProfile } from '../../actions/profileActions';
import { Link } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
class RallyEventPage extends Component {

  constructor(props) {
      super(props);

      //component state: rally form fields
      this.state = {

        locationSuggestion: '',
        locationVote: ''

      }

      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e){
      this.setState({[e.target.name]: e.target.value});
  }

  onSubmit(e) {
      e.preventDefault();

      const votingData = {

          //displayRestrictions: this.state.displayRestrictions,
          name: this.state.name,

      }
      // call redux action for passing this rallyData into post

      //TODO: create vote submission
      //this.props.submitVote(votingData, this.props.history);

  }

  componentWillReceiveProps(nextProps){

      if(nextProps.errors){
          this.setState({errors: nextProps.errors});
      }
      console.log(nextProps)

  }

  componentDidMount(){

    // this relies on getRallyByID returning props (rally) that
    // get mapped to the component for later use in div


    this.props.clearCurrentProfile();
    //console.log("rally params: ",this.props.match.params.rallyID);
    if(this.props.match.params.rallyID){
      this.props.getRallyByID(this.props.match.params.rallyID);
      console.log("rallyID: ", this.props.match.params.rallyID);

      // this finishes successfully but the correct rally prop does
      // not get mapped to the state / component by getRallyByID.
      // TODO: figure out how getRallyByID is actually setting
      // the RallyEventPage component's props

    }else{
      return;
    }
  }

  render() {

    //console.log(this.props.rally.rallies);
    const {loading} = this.props.rally;

    if( this.props.rally.rallies === null || loading ) {
      pageData = <h4>Loading...</h4>
    }else{

    }

    let pageData;

    // TODO: THIS IS NOT WORKING RIGHT NOW.. is this checking that the url id matches rally ID?
    if(this.props.rally.rallies && this.props.match.params.rallyID){

      console.log("da name: ", this.props.rally.rallies.name);

      // TODO:
      // 1. Implement checking whether user has already voted
      //    in order to determine which Voting card to display
      // 2. Location Poll Vote buttons link to backend + CREATE SCHEMA
      // 3. Backend for storing arrays from CSV entries for members
      // 4. Add Member button hooked to backend
      // 5. Displaying members names instead of IDs
      // 6. Showing only the restrictions that are non-empty

      let memberInfo;
      if(this.props.rally.rallies.members){

        memberInfo = (
          <div>
          {this.props.rally.rallies.members.slice().map((person, index) => (
            <li key={index} className="list-group-item">
              <small className="text-muted">{person}</small>
            </li>
          ))}
          </div>
        )
      }
      else{
        memberInfo = <h6>no member array</h6>
      }

      let ownerInfo;
      if(this.props.rally.rallies.owners){

        ownerInfo = (
          <div>
            <div className="row">
              <div className="col-md-2">
                <h5>Organizers</h5>
              </div>

              <div className="col-md-10">
                {this.props.rally.rallies.owners.slice().map((person, index) => (
                  <small className="text-muted">{person}, </small>
                ))}
              </div>

            </div>
          </div>
        )
      }
      else{
        ownerInfo = <h6>no owner array</h6>
      }
      let restrictions;
      let restrictionData;
      if(this.props.rally.rallies.restrictions){
          restrictions = this.props.rally.rallies.restrictions;
          //console.log(restrictions);
          console.log("eln: ",this.props.rally.rallies.restrictions);
          // for(let i = 0; i < restrictions.length; i++){
          //   //console.log("res: ",restrictions[i]);
          // }
          // if(restrictions.earliestTime){
          //   console.log(restrictions.earliestTime);
          // }


          Object.keys(restrictions).map(function(key, index) {
            console.log(restrictions[key], key);
          });
          let earliestTime;
          let latestTime;
          let location;
          let locationSuggRadius;
          let timeOfWeek;
          let startDate;
          let endDate;


          if(restrictions.earliestTime){
            //console.log("earlis:", restrictions.earliestTime);
              earliestTime = (
                <div>
                  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>

                    <div className="row">
                      <div className="col-md-1">
                        <i className="far fa-clock"></i>
                      </div>
                      <div className="col-md-10">
                        <p>Earliest Start Time: <b>{moment(restrictions.earliestTime).format('HH:mm A')}</b></p>
                      </div>
                    </div>

                </div>
              )
          }else{earliestTime = null;}

          if(restrictions.latestTime){
            latestTime = (
              <div>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>

                  <div className="row">
                    <div className="col-md-1">
                      <i className="far fa-clock"></i>
                    </div>
                    <div className="col-md-10">
                      <p>Latest End Time: <b>{moment(restrictions.latestTime).format('HH:mm A')}</b></p>
                    </div>
                  </div>

              </div>
            )
          }else{latestTime = null;}
          if(restrictions.location){
            location = (
              <div><p>Predetermined Location: <b>{restrictions.location}</b></p></div>
            )
          }else{location=null;}
          if(restrictions.timeOfWeek){
            timeOfWeek = (
              <div><p>Only schedule on: <b>{restrictions.timeOfWeek}</b></p></div>
            )
          }else{timeOfWeek = null;}
          if(restrictions.startDate){



            startDate = (

              <div>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>

                  <div className="row">
                    <div className="col-md-1">
                      <i className="far fa-calendar-check"></i>
                    </div>
                    <div className="col-md-10">
                      <p>Date Range Start: <b>{moment(restrictions.startDate).format('MM-DD-YYYY')}</b></p>
                    </div>
                  </div>

              </div>

            )
          }else{startDate = null;}
          if(restrictions.endDate){
            endDate = (

              <div>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"/>

                  <div className="row">
                    <div className="col-md-1">
                      <i className="far fa-calendar-check"></i>
                    </div>
                    <div className="col-md-10">
                      <p>Date Range End: <b>{moment(restrictions.endDate).format('MM-DD-YYYY')}</b></p>
                    </div>
                  </div>

              </div>

            )
          }else{endDate=null;}

          //let restrictionData;

          restrictionData = (
            <div>
              {location}
              {startDate}
              {endDate}
              {earliestTime}
              {latestTime}
              {timeOfWeek}

            </div>
          )



      }else{
        restrictionData = <h5>No restrictions set. Take the reigns!</h5>;
      }

      pageData = (
                <div>
                <h1 className="display-4">{this.props.rally.rallies.name}</h1>


                  <div className="card card-body bg-light mb-12">

                    {ownerInfo}
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
                            <h3>
                              Location Voting
                            </h3>
                            <p>Vote on a location or suggest your own!</p>

                            <li key="1" className="list-group-item">
                            <div className="row">
                              <div className="col-md-8">
                                Central Park
                              </div>
                              <div className="col-md-3">
                                <div className="btn btn-info btn-xs">
                                  Vote
                                </div>
                              </div>
                            </div>
                            </li>
                            <li key="2" className="list-group-item">
                            <div className="row">
                              <div className="col-md-8">
                                Dunkin Donuts
                              </div>
                              <div className="col-md-3">
                                <div className="btn btn-info btn-xs">
                                  Vote
                                </div>
                              </div>
                            </div>
                            </li>
                            <li key="3" className="list-group-item">

                            <div className="row">
                              <div className="col-md-8">
                                Six Flags
                              </div>
                              <div className="col-md-3">
                                <div className="btn btn-info btn-xs">
                                  Vote
                                </div>
                              </div>
                            </div>
                            </li>

                            <br></br>

                            <TextFieldGroup
                                placeholder="Location suggestion"
                                name="locationSuggestion"
                                type="locationSuggestion"
                                value={this.state.locationSuggestion}
                                onChange={this.onChange}
                                info="If you do not see an option you like, suggest one!"
                            />
                            <small className="form-text text-muted">* This counts as your vote!</small>
                            <span className="btn btn-info">
                              Submit Suggestion
                            </span>




                          </div>
                        </div>
                      </div>


                      <div className="col-md-6">
                        <div className="well">
                          <div className="card card-body bg-light mb-3">
                            <h3>Members</h3>
                            <p fontSize="20px">Those who can attend the number one time slot are italicized.</p>
                              {memberInfo}

                          <br></br>

                            <TextFieldGroup
                                placeholder="Add members by email"
                                name="addMembers"
                                type="addMembers"
                                value={this.state.addMembers}
                                onChange={this.onMembersChange}
                                info="Enter emails separated by commas."
                            />
                            <span className="btn btn-info">
                              Invite
                            </span>


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
  rally: PropTypes.object.isRequired,
  //auth: PropTypes.object.isRequired

}

const mapStateToProps = state => ({

  rally: state.rally,
  //auth: state.auth
})

// connects the props of the state returned from getRallyByID
// and those in the component, then exports the component
// with these props and state
export default connect(mapStateToProps, {getRallyByID, clearCurrentProfile})(withRouter(RallyEventPage));
