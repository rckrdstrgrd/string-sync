import React from 'react';

import { isVideoActive } from 'util/videoStateCategory';

import { Point } from 'types/point';
import { Artist } from 'services/vexflow';

interface CaretProps {
  // videoPlayer: any;
  // videoState: string;
  // artist: Artist;
}

interface CaretState {
  shouldRAF: boolean;
  currentTime: number;
  pos: Point;
}

const dupState = (state: CaretState): CaretState => {
  const pos = Object.assign(state.pos);
  return Object.assign({}, state, pos);
};

class Caret extends React.Component<CaretProps, CaretState> {
  RAFHandle: number = null;

  // componentWillReceiveProps(nextProps: CaretProps): void {
  //   const shouldRAF = nextProps.videoPlayer && isVideoActive(nextProps.videoState);
  //   const nextState = dupState(this.state);
  //   this.setState(Object.assign(nextState, { shouldRAF }));
  // }

  // componentDidUpdate(): void {
  //   if (this.state.shouldRAF) {
  //     this.RAFHandle = window.requestAnimationFrame(() => this.updateStateWithPlayer())
  //   } else {
  //     window.cancelAnimationFrame(this.RAFHandle);
  //     this.RAFHandle = null;
  //   }
  // }

  // shouldComponentUpdate(nextProps: CaretProps, nextState: CaretState): boolean {
  //   return (
  //     nextState.shouldRAF ||
  //     this.props.videoPlayer != nextProps.videoPlayer
  //   );
  // }

  updateStateWithPlayer = (): void => {

  }

  render(): JSX.Element {
    return (
      <div>
        Caret
      </div>
    );
  }
}

export default Caret;
