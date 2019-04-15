import React, { Component } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
//import Dashboard from './components/dashboard/Dashboard';
import CreateRally from './components/create-rally/CreateRally';
import Rallies from './components/rallies/Rallies';
import RallyEventPage from './components/rally/RallyEventPage';



import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import PrivateRoute from './components/common/PrivateRoute';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

//check for jwtToken
if(localStorage.jwtToken){
  // set auth token header authActions
  setAuthToken(localStorage.jwtToken);
  //decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime){
    //logout users if timed out
    store.dispatch(logoutUser());
    //TODO: clear current profile
    store.dispatch(clearCurrentProfile());
    //redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component= {Register} />
              <Route exact path="/login" component= {Login} />


              <Switch>
                <PrivateRoute exact path="/rally" component= {Rallies} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/create-rally" component= {CreateRally} />
              </Switch>

              <Switch>
                <PrivateRoute exact path="/:rallyID" component= {RallyEventPage} />
              </Switch>

            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
