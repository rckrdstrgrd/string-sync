import React from 'react';
import { connect } from 'react-redux';

import Icon from 'antd/lib/icon';
import { VexTab, Artist, Flow, Formatter, Player } from 'services/vexflow';
import { isEqual } from 'lodash';

import { Viewport } from 'types/device';

const { Renderer } = Flow;

interface ScoreProps {
  viewport: Viewport;
  measuresPerLine: number;
  numMeasures: number;
  vextab: string;
  tabPlayer: Player;
  formatter: Formatter;
  setMeasuresPerLine(measuresPerLine: number): void;
  setNumMeasures(numMeasures: number): void;
  setArtist(artist: Artist): void;
  resetTab(): void;
}

interface ScoreState {}

class Score extends React.Component<ScoreProps, ScoreState> {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  renderer: any;
  artist: Artist;

  componentDidMount(): void {
    const { formatter } = this.props;

    this.renderScore();
    this.maybeSetMeasuresPerLine(formatter.measuresPerLine);
    this.maybeSetNumMeasures(formatter.measures.length);
    this.props.setArtist(this.artist);
  }

  shouldComponentUpdate(nextProps: ScoreProps): boolean {
    return (
      this.props.measuresPerLine !== nextProps.measuresPerLine ||
      this.props.numMeasures !== nextProps.numMeasures ||
      !isEqual(this.props.viewport, nextProps.viewport) ||
      this.props.vextab !== nextProps.vextab
    );
  }

  componentDidUpdate(): void {
    const { formatter } = this.props;

    this.renderScore();
    this.maybeSetMeasuresPerLine(formatter.chunkSize);
    this.maybeSetNumMeasures(formatter.measures.length);
    this.props.setArtist(this.artist);
    this.props.tabPlayer.artist = this.artist;
  }

  componentWillUnmount(): void {
    this.props.resetTab();
  }

  setCanvas = (c: HTMLCanvasElement): void => {
    if (!c || (this.canvas && this.ctx)) {
      return;
    }

    this.canvas = c;
    this.ctx = c.getContext('2d');
    this.renderer = new Renderer(c, Renderer.Backends.CANVAS);
  }

  maybeSetMeasuresPerLine = (measuresPerLine: number): void => {
    if (measuresPerLine !== this.props.measuresPerLine) {
      this.props.setMeasuresPerLine(measuresPerLine);
    }
  }

  maybeSetNumMeasures = (numMeasures: number): void => {
    if (numMeasures !== this.props.numMeasures) {
      this.props.setNumMeasures(numMeasures);
    }
  }

  renderScore(): void {
    const { viewport, formatter, vextab } = this.props;

    if (vextab.length === 0) {
      return;
    }

    let artist = new Artist(10, 0, viewport.width - 10, { scale: 1.0 });
    let tab = new VexTab(artist);

    try {
      tab.parse(vextab);
      const formatted = formatter.update(vextab, viewport.width, tab.elements);

      artist = new Artist(10, 0, viewport.width - 10, { scale: 1.0 });
      tab = new VexTab(artist);
      tab.parse(formatted);

      artist.render(this.renderer);
      this.renderTabText(artist);
    } catch (e) {
      // noop
    }

    this.artist = artist;
  }

  renderTabText(artist: Artist): void {
    this.ctx.save();
    this.ctx.font = '24px sans-serif';

    artist.staves.map(stave => {
      let x = 25;
      let y = stave.tab.y + 73;
      this.ctx.fillText('T', x, y);
      this.ctx.fillText('A', x, y + 20);
      this.ctx.fillText('B', x, y + 40);
    });

    this.ctx.restore();
  }

  render(): JSX.Element {
    return (
      <div>
        <canvas ref={this.setCanvas} />
      </div>
    );
  }
}

import { setMeasuresPerLine, setNumMeasures, setArtist, resetTab } from 'data/tab/actions';

const mapStateToProps = state => ({
  viewport: state.device.viewport,
  measuresPerLine: state.tab.measuresPerLine,
  numMeasures: state.tab.numMeasures,
  vextab: state.notation.vextab,
  tabPlayer: state.tab.player,
  formatter: state.tab.formatter
});

const mapDispatchToProps = dispatch => ({
  setMeasuresPerLine: (measuresPerLine: number) => dispatch(setMeasuresPerLine(measuresPerLine)),
  setNumMeasures: (numMeasures: number) => dispatch(setNumMeasures(numMeasures)),
  setArtist: (artist: Artist) => dispatch(setArtist(artist)),
  resetTab: () => dispatch(resetTab())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Score);
