import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { showcase } from '../../img/showcase.jpg';
import { clearCurrentProfile } from '../../actions/profileActions';


class Navbar extends Component {

  onLogoutClick(e){
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  //Render is a lifecycle method
  render(){

    const { isAuthenticated, user } = this.props.auth;
    let hrefLink = "#";
    const authLinks = (
      <div>

      <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/rally">
          Profile
        </Link>

      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/create-rally">
          Create Rally
        </Link>

      </li>
        <li className="nav-item">
          <a
            href={hrefLink}
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            <img
              className="rounded-circle"
              src={showcase}
              alt=""
              style={{width: '25px', marginRight: '5px'}}

            /> {' '}
            Logout {user.name}
          </a>
        </li>

      </ul>

      </div>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Rally
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
              <span className="navbar-toggler-icon"></span>
            </button>



              {isAuthenticated ? authLinks : guestLinks}


          </div>
        </nav>
    )
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile})(Navbar);
