import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';

//import Spinner from '../common/Spinner';

class Dashboard extends Component {

    //use lifecycle method because we want it to be called right away
    componentDidMount() {
        this.props.getCurrentProfile();
    }
    render() {

        //make sure profile is not null before rendering
        const { user } = this.props.auth;
        const { profile, loading } = this.props.profile;

        let dashboardContent;

        if(profile === null || loading){
            dashboardContent = <h4>Loading...</h4>;//<Spinner />;
        } else {

            // check if logged in user has rally/profile data
            if(Object.keys(profile).length > 0){
                dashboardContent = <h4>TODO: Display Rallies</h4>;
            }else{
                //user is logged in but has no rallies: create profile / rally
                dashboardContent = (
                    <div>
                        <p className="lead text-muted">Welcome { user.name }</p>
                        <p>You do not have any Rallies to display. Try making one!</p>
                        <Link to="/create-rally" className="btn btn-lg btn-info">
                            Create a Rally
                        </Link>

                    </div>
                )

            }
        }
        return (
            <div className = "dashboard">
                <div className = "container">
                    <div className = "row">
                        <div className= "col-md-12">
                            <h1 className="display-4">My Rallies</h1>
                            {dashboardContent}

                        </div>
                    </div>
                    <div className = "row">
                        <div className= "col-md-12">
                            <div>
                            <p></p>
                                <p className="lead text-muted">{ user.name }'s Invitations</p>
                                <p>Rallies you are part of or have been invited to will show here!</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
