import React from 'react';
import { Affix, Icon } from 'antd';
import { Gradient, LogoImage, LogoText } from 'components';
import LibraryGrid from './grid';
import { TagNotationsMap } from '../Library';

interface MobileLibraryProps {
  tagNotationsMap: TagNotationsMap;
}

interface MobileLibraryState {

}

class MobileLibrary extends React.PureComponent<MobileLibraryProps, MobileLibraryState> {
  render(): JSX.Element {
    const { tagNotationsMap } = this.props;

    return (
      <div className="Library--mobile">
        <div className="Library--mobile__headerSpacer">
          <LogoImage style={{ width: '48px', paddingTop: '10px' }}/>
        </div>
        <div className="Library--mobile__header">
          <div className="Library--mobile__header__logo">
            <LogoText style={{ fontSize: '24px' }}/>
          </div>
        </div>
        {
          tagNotationsMap.map((tagNotations) => (
            <div id={tagNotations.tag} key={tagNotations.tag}>
              <div className="Library--mobile__content__titleContainer">
                <Affix target={() => window} offsetTop={2}>
                  <h1 className="Library--mobile__content__title">
                    {tagNotations.tag.toUpperCase()}
                  </h1>
                </Affix>
              </div>
              <LibraryGrid tagNotations={tagNotations} />
            </div>
          ))
        }
      </div>
    );
  }
}

export default MobileLibrary;
