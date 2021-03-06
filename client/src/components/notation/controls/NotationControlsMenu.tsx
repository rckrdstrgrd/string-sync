import * as React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon, Switch } from 'antd';
import { withSession, withNotation } from 'enhancers';

const { SubMenu, ItemGroup, Item } = Menu;

const enhance = compose (
  withRouter,
  withSession,
  withNotation,
  withProps(props => {
    const { currentUser } = props.session.state;
    const { transcriber } = props.notation.state;

    return ({
      showEditItem: (
        currentUser.roles.includes('admin') ||
        currentUser.id === transcriber.id
      )
    });
  })
);

const NotationControlsMenu = ({ match, showEditItem, collapsed }) => (
  <Menu
    className="NotationControlsMenu"
    defaultSelectedKeys={[]}
    defaultOpenKeys={[]}
    mode="inline"
    theme="dark"
    inlineCollapsed={collapsed}
    onClick={() => null}
  >
    <Item key="print">
      <Link to={`/n/${match.params.id}/print`}>
        <Icon type="printer" />
        <span>print</span>
      </Link>
    </Item>
    {
      showEditItem
        ? <Item>
            <Link to={`/n/${match.params.id}/edit`}>
              <Icon type="edit" />
              <span>edit</span>
            </Link>
          </Item>
        : null
    }
  </Menu>
);

export default enhance(NotationControlsMenu);
