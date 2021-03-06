import * as React from 'react';
import { Row, Col } from 'antd';
import { Loop, Scrubber, Play, ToggleControls } from './';

const ControlRow1 = () => (
  <Row
    className="NotationControls__row1"
    type="flex" align="middle" justify="center"
  >
    <Col span={22}>
      <Loop />
    </Col>
  </Row>
);

const ControlRow2 = () => (
  <Row
    className="NotationControls__row2"
    type="flex" align="middle" justify="center"
  >
    <Col span={22}>
      <Scrubber />
    </Col>
  </Row>
);

const NotationControls = () => (
  <div className="NotationControls__content">
    <Row type="flex" align="middle" justify="center">
      <Col span={2}>
      <Row
        className="NotationControls__content--aside"
        type="flex" align="middle" justify="end"
      >
          <Play />
        </Row>
      </Col>
      <Col span={16}>
        <ControlRow1 />
        <ControlRow2 />
      </Col>
      <Col span={2}>
        <Row
          className="NotationControls__content--aside"
          type="flex" align="middle" justify="start"
          >
          <ToggleControls />
        </Row>
      </Col>
    </Row>
  </div>
);

export default NotationControls;
