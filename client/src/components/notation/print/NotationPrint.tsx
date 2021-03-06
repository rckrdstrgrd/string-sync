import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose, withProps, lifecycle } from 'recompose';
import { withNotation, textWhileLoading } from 'enhancers';
import { Gradient, Tab, IconDescribe } from 'components';
import { Row } from 'antd';

const enhance = compose(
  withNotation,
  withRouter,
  withProps(props => ({
    isLoading: parseInt(props.notation.state.id, 10) !== parseInt(props.match.params.id, 10)
  })),
  lifecycle({
    componentDidMount(): void {
      const notationId = this.props.match.params.id;
      this.props.notation.dispatch.fetchNotation(notationId);
    }
  })
);

const NotationPrintHeader = ({ isLoading, notation }) => (
  <div className="NotationPrint__header">
    <div className="Print--hide">
      <Gradient />
      <Row type="flex" justify="start">
        <Link to={`/n/${notation.id}`}>
          <IconDescribe
            type="close"
            description="back"
          />
        </Link>
      </Row>
    </div>
    {
      isLoading
        ? null
        : <div className="NotationPrint__title">
            <h3>{`${notation.songName} by ${notation.artistName}`}</h3>
            <p>{`transcribed by @${notation.transcriber.username}`}</p>
          </div>
    }
  </div>
);

const NotationPrint = ({ isLoading, notation }) => (
  <div className="NotationPrint">
    <NotationPrintHeader
      isLoading={isLoading}
      notation={notation.state}
    />
    <Tab
      allowOverflow
      overrideWidth={900}
    />
  </div>
);

export default enhance(NotationPrint);
