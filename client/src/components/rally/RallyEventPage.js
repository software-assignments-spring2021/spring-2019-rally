import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRallyByID, clearCurrentProfile } from '../../actions/profileActions';
import { Link } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
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

  }

  componentDidMount(){

    // this relies on getRallyByID returning props (rally) that
    // get mapped to the component for later use in div

    //console.log("rally params: ",this.props.match.params.rallyID);
    this.props.clearCurrentProfile();
    if(this.props.match.params.rallyID){
      this.props.getRallyByID(this.props.match.params.rallyID);
      console.log("rallyID: ", this.props.match.params.rallyID);

      // this finishes successfully but the correct rally prop does
      // not get mapped to the state / component by getRallyByID.
      // TODO: figure out how getRallyByID is actually setting
      // the RallyEventPage component's props

    }else{
      console.log("didnt match");
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
      // 7.

      pageData = (
                <div>
                <h1 className="display-4">{this.props.rally.rallies.name}</h1>

                <div className="row">

                  <div className="col-md-4">
                    <div className="well">
                      <div className="card card-body bg-light mb-3">
                        <h3>Details</h3>
                        <p>These are the scheduling details and restrictions we have from you so far.</p>
                        <h6>Duration: {this.props.rally.rallies.duration} hour(s)</h6>

                          <h6>Restrictions:</h6>
                          <p>Predetermined Location: </p>
                          <p>Start Time: </p>
                          <p>End Time: </p>
                          <p>LocationSuggRadius: </p>
                          <p>Start Date: </p>
                          <p>End Date: </p>
                          <p>Time of Week: </p>


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
                            {this.props.rally.rallies.members.slice().map((person, index) => (
                              <li key={index} className="list-group-item">
                                <small className="text-muted">{person}</small>
                              </li>
                            ))}

                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br></br>
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
              <div className="row">
                <div className="col-md-4">
                    <div className="well">
                      <div className="card card-body bg-light mb-3">
                        <h5>Organizers</h5>

                        {this.props.rally.rallies.members.slice().map((person, index) => (

                            <small className="text-muted">{person}</small>

                        ))}



                      </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="well">

                        <h6>7.</h6>

                    </div>
                </div>
                <div className="col-md-4">
                    <div className="well">

                      <h6>8.</h6>

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
export default connect(mapStateToProps, {getRallyByID, clearCurrentProfile})(RallyEventPage);
