import * as React from 'react';
import { compose, setStatic } from 'recompose';
import Fret from './Fret';
import { Row, Col } from 'antd';

const DOTS: Array<number> = [
  0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
  2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0
];

const DESKTOP_DOTS: Array<number> = DOTS.slice();

const MOBILE_DOTS: Array<number> = DOTS.slice(0, 16);

const enhance = compose(
  setStatic('DOTS', DOTS),
  setStatic('DESKTOP_DOTS', DESKTOP_DOTS),
  setStatic('MOBILE_DOTS', MOBILE_DOTS)
);

const Frets = () => (
  <div className="Frets">
    <Row type="flex">
      {
        DOTS.map((dots, fret) => (
          <Col
            span={fret === 0 ? 2 : 1}
            key={`fret-${fret}`}
          >
            <Fret fret={fret} dots={dots} />
          </Col>
        ))
      }
    </Row>
  </div>
);

export default enhance(Frets);
