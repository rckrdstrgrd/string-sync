import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Icon from 'antd/lib/icon';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

interface BannerProps {
  isLoggedIn: boolean;
  name: string;
  artist: string;
  transcriber: string;
  notationId: number;
}

interface BannerState {}

class Banner extends React.Component<BannerProps, BannerState> {
  render(): JSX.Element {
    const { isLoggedIn, name, artist, transcriber, notationId } = this.props;

    const bannerText = notationId < 0 ? 'Loading...' : `${name} by ${artist} (${transcriber})`;

    return (
      <div className="NotationShowBanner" >
        <Row type="flex" align="middle" justify="center">
          <Col span={5} />
          <Col className="NotationShowBanner__text" span={14}>
            {bannerText}
          </Col>
          <Col span={5}>
            <Row className="NotationShowBanner__icons" type="flex" justify="end">
              <span>
                <Link to="/library">
                  <div className="NotationsShowBanner__back">
                    <Icon type="close" style={{ fontSize: '24px' }} />
                    <span>back</span>
                  </div>
                </Link>
              </span>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  name: state.notation.name,
  artist: state.notation.artist,
  transcriber: state.notation.transcriber,
  notationId: state.notation.id
});

const mapDispatchToProps = dispatch => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Banner);
