import React from 'react';
import { connect } from 'react-redux';

import Row from 'antd/lib/row';
import Icon from 'antd/lib/icon';
import ToolTip from 'antd/lib/tooltip';

import formatTime from 'util/formatTime';

interface PlayProps {
  isMobile: boolean;
  isVideoActive: boolean;
  shouldRAF: boolean;
  videoPlayer: any;
  RAFLoop: any;
}

interface PlayState {
  currentTime: string;
}

class Play extends React.Component<PlayProps, PlayState> {
  state: PlayState = {
    currentTime: '0.0'
  };

  componentWillReceiveProps(nextProps: PlayProps): void {
    const { shouldRAF, RAFLoop } = nextProps;

    if (shouldRAF) {
      if (!RAFLoop.has('Play.updateTime')) {
        this.registerRAFLoop();
      }
    } else {
      this.unregisterRAFLoop();
    }
  }

  componentWillUnmount(): void {
    this.unregisterRAFLoop();
  }

  registerRAFLoop = (): void => {
    this.props.RAFLoop.register({
      name: 'Play.updateTime',
      onAnimationLoop: this.updateTime
    });
  }

  unregisterRAFLoop = (): void => {
    this.props.RAFLoop.unregister('Play.updateTime');
  }

  updateTime = (): void => {
    const currentTime = formatTime(this.props.videoPlayer.getCurrentTime());
    this.setState(Object.assign({}, this.state, { currentTime }));
  }

  pauseVideo = (): void => {
    this.props.videoPlayer.pauseVideo();
  }

  playVideo = (): void => {
    this.props.videoPlayer.playVideo();
  }

  render(): JSX.Element {
    const { isMobile, isVideoActive } = this.props;
    const { currentTime } = this.state;

    return (
      <span>
        <ToolTip placement="top" title={`${currentTime}s`}>
          {
            isVideoActive ?
              <Icon type="pause-circle-o" onClick={this.pauseVideo} /> :
              <Icon type="play-circle-o" onClick={this.playVideo} />
          }
        </ToolTip>
      </span>
    );
  }
}

import { isVideoActive } from 'util/videoStateCategory';

const mapStateToProps = state => ({
  isMobile: state.device.type === 'MOBILE' || state.device.isTouch,
  isVideoActive: isVideoActive(state.video.state),
  videoPlayer: state.video.player,
  shouldRAF: isVideoActive(state.video.state),
  RAFLoop: state.raf.loop
});

const mapDispatchToProps = dispatch => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Play);
