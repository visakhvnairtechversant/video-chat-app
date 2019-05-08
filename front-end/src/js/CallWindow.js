import React, { Component } from 'react';
import PropTypes from 'proptypes';
import classnames from 'classnames';
import _ from 'lodash';

class CallWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Video: true,
      Audio: true
    };

    this.btns = [
      { type: 'Video', icon: 'fa-video-camera' },
      { type: 'Audio', icon: 'fa-microphone' }
    ];
  }

  componentDidMount() {
    this.setMediaStream();
  }

  componentWillReceiveProps(nextProps) {
    // Initialize when the call started
    if (!this.props.config && nextProps.config) {
      const { config, mediaDevice } = nextProps;
      _.forEach(config, (conf, type) =>
        mediaDevice.toggle(_.capitalize(type), conf));

      this.setState({
        Video: config.video,
        Audio: config.audio
      });
    }
  }

  componentDidUpdate() {
    this.setMediaStream();
  }

  setMediaStream() {
    const { peerSrc, localSrc } = this.props;
    if (this.peerVideo && peerSrc) this.peerVideo.srcObject = peerSrc;
    if (this.localVideo && localSrc) this.localVideo.srcObject = localSrc;
  }

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  toggleMediaDevice(deviceType) {
    this.setState({
      [deviceType]: !this.state[deviceType]
    });
    this.props.mediaDevice.toggle(deviceType);
  }

  renderControlButtons() {
    const getClass = (icon, type) => classnames(`  btn btn-primary btn-sm ${type.toLowerCase()}-btn fa ${icon}`, {
      disable: !this.state[type]
    });

    return this.btns.map(btn => (
      <button
        key={`btn${btn.type}`}
        className={getClass(btn.icon, btn.type)}
        onClick={() => this.toggleMediaDevice(btn.type)}
      />
    ));
  }
  render() {
    const { status } = this.props;
    return (

    <div className="col-6">
        <h4>Video Chat</h4>
        <div className="{test}">


          <div className={classnames("video-chat-box",status)}>
          <video className="peer-video" id="peerVideo" ref={el => this.peerVideo = el} autoPlay></video>

          <video className="user-video" id="localVideo" ref={el => this.localVideo = el} autoPlay muted ></video>

          <br/>
          <div className="text-center chat-ctrl-btn-group">
          {this.renderControlButtons()}
            <button type="button" className="btn btn-sm  btn-danger fa fa-times" onClick={() => this.props.endCall(true)} ></button>
          </div>
        </div>  
          </div>
      </div>
      
    );
  }
}

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.object, // eslint-disable-line
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired
};

export default CallWindow;
