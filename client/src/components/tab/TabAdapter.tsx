import * as React from 'react';
import { compose, withState, lifecycle, withProps, withHandlers } from 'recompose';
import { withNotation, withTab, withViewport, withSync } from 'enhancers';
import { Tab } from 'services';

const enhance = compose(
  withNotation,
  withTab,
  withViewport,
  withSync,
  withState('focusedNote', 'setFocusedNote', null),
  withProps(props => ({
    width: props.overrideWidth || props.viewport.state.width,
    vextabString: props.notation.state.vextabString
  })),
  withHandlers({
    handleAnimationLoop: props => () => {
      const { snapshot } = props.sync.state.maestro;
      const { note } = snapshot.data
      const { focusedNote } = props;
      
      if (note !== focusedNote) {
        props.tab.state.instance.updateNoteColors(focusedNote, note);
        props.setFocusedNote(note);
      }
    }
  }),
  withProps(props => {
    const { rafLoop } = props.sync.state;
    const name = 'TabService.handleAnimationLoop';

    return ({
      registerRaf: () => {
        rafLoop.register({
          name,
          precedence: 4,
          onAnimationLoop: props.handleAnimationLoop
        });
      },
      unregisterRaf: () => {
        rafLoop.unregister(name);
      }
    });
  }),
  lifecycle({
    componentWillReceiveProps(nextProps: any): void {
      nextProps.unregisterRaf();

      const { maestro } = nextProps.sync.state;

      const shouldCreateTab = (
        !nextProps.tab.state.instance ||
        !maestro.tab ||
        maestro.tab.vextabString !== nextProps.vextabString ||
        maestro.tab.width !== nextProps.width
      );

      if (shouldCreateTab) {
        const tab = new Tab(nextProps.vextabString, nextProps.width);
        maestro.tab = tab;
        nextProps.tab.dispatch.setTab(tab);
      }

      if (nextProps.isDynamic) {
        nextProps.registerRaf();
      }
    },
    componentWillUnmount(): void {
      this.props.unregisterRaf();
      this.props.sync.state.maestro.tab = null;
      this.props.tab.dispatch.resetTab();
    }
  })
);

const TabAdapter = () => null;

export default enhance(TabAdapter);
