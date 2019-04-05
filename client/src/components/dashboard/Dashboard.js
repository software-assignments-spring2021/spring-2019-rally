import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';

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
            dashboardContent = <h4>Loading...</h4>
        } else {
            dashboardContent = <h1>Hello</h1>
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
