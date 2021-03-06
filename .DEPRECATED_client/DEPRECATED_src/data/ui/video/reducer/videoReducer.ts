import videoActions from '../actions';
import { Video } from 'types';
import { isVideoActive } from 'stringSyncUtil';

const { SET_PLAYER, SET_PLAYER_STATE, SET_LOOP, RESET_VIDEO } = videoActions;

const defaultState: Video = Object.freeze({
  player: null,
  playerState: '',
  isActive: false,
  loop: [0, Number.MAX_SAFE_INTEGER]
});

export default (state = defaultState, action) => {
  Object.freeze(state);
  const loop = Object.assign([], state.loop);
  const nextState = Object.assign({}, state, { loop });

  switch (action.type) {
    case SET_PLAYER:
      nextState.player = action.player;
      return nextState;

    case SET_PLAYER_STATE:
      nextState.playerState = action.playerState;
      nextState.isActive = isVideoActive(action.playerState);
      return nextState;

    case SET_LOOP:
      nextState.loop = action.loop;
      return nextState;

    case RESET_VIDEO:
      return Object.assign({}, defaultState);

    default:
      return nextState;
  }
};
