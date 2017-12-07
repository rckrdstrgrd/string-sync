
import React from 'react';
import { compose } from 'recompose';
import { withTab, withVideo, withRaf } from 'enhancers';

class ScoreScroller extends React.Component<any, any> {
  currLine: number = 0;
  scoreContainer: any = null;
  scrollPositions: Array<number> = [];
  currLineIndex: number = 0;

  componentDidMount(): void {
    this.registerRAFLoop();
  }

  componentWillReceiveProps(nextProps: any): void {
    this.updateRefs();
  }

  componentWillUnmount(): void {
    this.unregisterRAFLoop();
  }

  registerRAFLoop(): void {
    const RAFLoop = this.props.raf.loop;

    if (!RAFLoop.has('ScoreScroller.updateScroll')) {
      RAFLoop.register({
        name: 'ScoreScroller.updateScroll',
        precedence: 6,
        onAnimationLoop: this.updateScroll
      });
    }
  }

  unregisterRAFLoop(): void {
    this.props.raf.loop.unregister('ScoreScroller.updateScroll');
  }

  updateRefs = (): void => {
    this.scoreContainer = $('#ScoreContainer')[0];
    this.scrollPositions = Array.from($('.ScoreLine')).map(el => $(el).position().top);
  }

  updateScroll = (dt: number): void => {
    if (this.scoreContainer === null || this.scrollPositions.length === 0) {
      return;
    }

    try {
      const { scrollSpec } = this.props.tab.provider.player;
      if (scrollSpec) {
        const lineIndex = scrollSpec.lowTick.staveIndex;
        if (this.currLineIndex !== lineIndex) {
          this.currLineIndex = lineIndex;
          this.scoreContainer.scrollTop = this.scrollPositions[this.currLineIndex];
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  render(): any {
    return null;
  }
}

const enhance = compose(
  withTab,
  withVideo,
  withRaf
);

export default enhance(ScoreScroller);
