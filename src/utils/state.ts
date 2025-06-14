import { Game, Hand, Options, Player, createHands, createPlayer } from './game';

export const initialState: Game = new Game();

export type GameAction =
  | { type: 'ADD_PLAYER'; payload: { name: string } }
  | { type: 'CLEAR_SCORES' }
  | { type: 'DELETE_PLAYER'; payload: { playerId: string } }
  | { type: 'EDIT_GAME'; payload: { game: Game } }
  | { type: 'EDIT_HAND'; payload: { hand: Hand } }
  | { type: 'EDIT_OPTIONS'; payload: { options: Options } }
  | { type: 'EDIT_PLAYER'; payload: { player: Player } }
  | { type: 'INIT_HANDS'; payload: { playerId: string } }
  | { type: 'NEW_GAME' }
  | { type: 'SET_ACTIVE_ROUND'; payload: { round: string } }
  | {
      type: 'SET_DEALER_ORDER';
      payload: { dealerOrder: { round: string; playerId: string }[] };
    };

const gameReducer = (state: Game, action: GameAction) => {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const name: string = action.payload.name;
      const newPlayer = createPlayer(name);

      return {
        ...state,
        players: [...state.players, newPlayer.player],
        hands: state.hands.concat(newPlayer.hands),
      };
    }
    case 'CLEAR_SCORES': {
      const newHands: Hand[] = [];
      state.players.map((player) => {
        const playerHands = createHands(player.id);
        newHands.push(...playerHands);
      });

      return {
        ...state,
        hands: newHands,
      };
    }
    case 'DELETE_PLAYER': {
      const playerId: string = action.payload.playerId;

      return {
        ...state,
        players: state.players.filter((player) => player.id != playerId),
        hands: state.hands.filter((hand) => hand.playerId != playerId),
      };
    }
    case 'EDIT_GAME': {
      return action.payload.game;
    }
    case 'EDIT_HAND': {
      return {
        ...state,
        hands: state.hands.map((hand) => {
          if (hand.id === action.payload.hand.id) {
            return action.payload.hand;
          } else {
            return hand;
          }
        }),
      };
    }
    case 'EDIT_OPTIONS': {
      return {
        ...state,
        options: action.payload.options,
      };
    }
    case 'EDIT_PLAYER': {
      return {
        ...state,
        players: state.players.map((player: Player) => {
          return player.id === action.payload.player.id
            ? action.payload.player
            : player;
        }),
      };
    }
    case 'NEW_GAME': {
      return initialState;
    }
    case 'SET_ACTIVE_ROUND': {
      return {
        ...state,
        activeRound: action.payload.round,
      };
    }
    case 'SET_DEALER_ORDER': {
      return {
        ...state,
        dealerOrder: action.payload.dealerOrder,
      };
    }
    default: {
      return state;
    }
  }
};

export default gameReducer;
