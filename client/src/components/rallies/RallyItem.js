import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import isEmpty from '../../validation/is-empty';

class RallyItem extends Component {
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
              <Link to ={`/${rally._id}`} className="btn btn-info">
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

export default RallyItem;
