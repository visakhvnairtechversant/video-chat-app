import React, { Component } from 'react';
import PropTypes from 'proptypes';

let friendID;

class MainWindow extends Component {
  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
   callWithVideo(video) {
    const config = { audio: true };
    config.video = video;
    return () => this.props.startCall(true, friendID, config);
  }
  render() {
    const { clientId } = this.props;
    document.title = `${clientId} - VideoCall`;
    return (
      <div className="col-6">
      <h4>Caller Infromation</h4>
      
      <div className="jumbotron">
      <label>Your id</label>
      <input type="text" className="form-control" readOnly value={clientId} />
      <label>Caller id</label>
      <input type="text" className="form-control" spellCheck={false} onChange={event => friendID = event.target.value}/>
      <br/>
      <div className="text-center">
      <button className="btn btn-primary btn-sm text-center" onClick={this.callWithVideo(true)}><i className="fa fa-video-camera"></i></button>
      </div>
      </div>
      </div>
      );
    }
  }

  MainWindow.propTypes = {
    clientId: PropTypes.string.isRequired,
    startCall: PropTypes.func.isRequired
  };

  export default MainWindow;
