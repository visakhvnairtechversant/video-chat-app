import React, { Component } from 'react';
import PropTypes from 'proptypes';
import classnames from 'classnames';

class CallModal extends Component {
  acceptWithVideo(video) {
    const config = { audio: true, video };
    return () => this.props.startCall(false, this.props.callFrom, config);
  }

  render() {
    return (

      <div className={classnames("col-12",this.props.status)}>
        <div className="text-center">
          <p>{this.props.callFrom} is calling</p>
          <button type="button" className="btn  btn-primary"  onClick={this.acceptWithVideo(true)} ><i className="fa fa-video-camera"></i></button>
          <button type="button" className="btn  btn-danger" onClick={this.props.rejectCall}><i className="fa fa-times"></i></button>
        </div>
      </div>


    );
  }
}

CallModal.propTypes = {
  status: PropTypes.string.isRequired,
  callFrom: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
  rejectCall: PropTypes.func.isRequired
};

export default CallModal;
