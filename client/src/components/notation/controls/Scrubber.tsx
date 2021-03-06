import * as React from 'react';
import { compose, withState, withProps, withHandlers, lifecycle } from 'recompose';
import { Slider } from 'antd';
import { withVideo, withSync, withNotation } from 'enhancers';

const enhance = compose (
  withVideo,
  withSync,
  withNotation,
  withState('value', 'setValue', 0),
  withState('isScrubbing', 'setIsScrubbing', false),
  withState('wasActive', 'setWasActive', false),
  withHandlers({
    handleAnimationLoop: props => dt => {
      const videoPlayer = props.video.state.player;

      if (!videoPlayer || props.isScrubbing) {
        return;
      }

      const durationMs = props.notation.state.durationMs || videoPlayer.getDuration() * 1000;
      const { currentTimeMs } = props.sync.state.maestro;
      const nextValue = (currentTimeMs / durationMs) * 100;

      // Avoid NaN
      if (nextValue === nextValue) {
        props.setValue(nextValue);
      }
    },
    handleChange: props => value => {
      if (props.video.state.isActive && !props.isScrubbing) {
        props.setWasActive(true);
      }

      if (!props.isScrubbing) {
        props.setIsScrubbing(true);

        if (props.video.state.playerState === 'PLAYING') {
          props.video.state.player.pauseVideo();
        }
      }

      const videoPlayer = props.video.state.player;
      const { maestro } = props.sync.state;
      const durationMs = props.notation.state.durationMs || videoPlayer.getDuration() * 1000;
      const nextTimeMs = (value / 100) * durationMs;

      maestro.currentTimeMs = nextTimeMs;
      maestro.update();

      videoPlayer.seekTo(nextTimeMs / 1000, true);
      props.setValue(value);
    },
    handleAfterChange: props => value => {
      const videoPlayer = props.video.state.player;
      const durationMs = props.notation.state.durationMs || videoPlayer.getDuration() * 1000;

      props.setIsScrubbing(false);
      props.setValue(value);

      const nextTimeSecs = ((value / 100) * durationMs) / 1000;
      videoPlayer.seekTo(nextTimeSecs, true);

      if (props.wasActive) {
        videoPlayer.playVideo();
      }

      props.setWasActive(false);
    },
  }),
  withProps(props => {
    const { rafLoop } = props.sync.state;
    const name = 'Scrubber.handleAnimationLoop';

    return ({
      registerRaf: () => {
        rafLoop.register({
          name,
          precedence: 7,
          onAnimationLoop: props.handleAnimationLoop
        });
      },
      unregisterRaf: () => {
        rafLoop.unregister(name);
      }
    });
  }),
  lifecycle({
    componentDidMount(): void {
      this.props.registerRaf();
    },
    componentWillUnmount(): void {
      this.props.unregisterRaf();
    }
  })
);

const Scrubber = ({ video, value, handleChange, handleAfterChange }) => (
  <div className="VideoScrubber">
    <Slider
      disabled={video.state.player === null}
      min={0}
      max={100}
      step={0.01}
      defaultValue={0}
      value={value}
      tipFormatter={null}
      onChange={handleChange}
      onAfterChange={handleAfterChange}
    />
  </div>
);

export default enhance(Scrubber);
