import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
//import isEmpty from '../../validation/is-empty';

import axios from 'axios';
import { connect } from 'react-redux';

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
              <div className="col-md-4 d-md-block">
                  <h5>Members</h5>

                  {rally.owners.slice().map((person, index) => (
                    <li key={index} className="list-group-item">
                      {person}
                    </li>
                  ))}
              </div>

              <div className="col-md-4 d-md-block">
                  <h5>Date/Time Leaderboard</h5>
                    <li key="1" className="list-group-item">
                      April 5, 2019       6-9pm
                    </li>
                    <li key="2" className="list-group-item">
                      April 12, 2019       6-9pm
                    </li>
                    <li key="3" className="list-group-item">
                      April 17, 2019      6-9pm
                    </li>
              </div>

              <div className="col-md-4 d-md-block">
                  <h5>Location</h5>
                    <li key="1" className="list-group-item">
                      voting option 1
                    </li>
                    <li key="2" className="list-group-item">
                      voting option 2
                    </li>
                    <li key="3" className="list-group-item">
                      voting option 3
                    </li>
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
