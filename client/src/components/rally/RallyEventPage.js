import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRallyByID } from '../../actions/profileActions';
import { Link } from 'react-router-dom';

class RallyEventPage extends Component {


  componentDidMount(){

    console.log("rally props: ",this.props.rally);
    if(this.props.match.params.rallyID){
      this.props.getRallyByID(this.props.match.params.rallyID);
    }else{
      console.log("didnt match")
    }
  }

  render() {


    return (
      <div className="rallies">

      </div>
    );
  }
}

RallyEventPage.propTypes = {
  getRallyByID: PropTypes.func.isRequired,
  rally: PropTypes.object.isRequired,
  //auth: PropTypes.object.isRequired

}

const mapStateToProps = state => ({

  rally: state.rally,
  //auth: state.auth
})

export default connect(mapStateToProps, {getRallyByID})(RallyEventPage);
