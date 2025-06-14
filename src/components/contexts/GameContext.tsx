import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useReducer,
} from 'react';

import { Hand, Game, Options, Player } from '../../utils/game';
import { storage } from '../../utils/storage';
import gameReducer, { initialState } from '../../utils/state';

export interface GameContextType {
  state: Game;
  players: Player[];
  addPlayer: (name: string) => void;
  clearScores: () => void;
  deletePlayer: (playerId: string) => void;
  editGame: (game: Game) => void;
  editHand: (hand: Hand) => void;
  editOptions: (options: Options) => void;
  editPlayer: (player: Player) => void;
  newGame: () => void;
  setActiveRound: (round: string) => void;
  setDealer: (round: string, playerId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [players, setPlayers] = useState(state.players);
  const [loading, setLoading] = useState<boolean>(true);

  // Things to run during first render
  useEffect(() => {
    storage
      .create()
      .then(() => storage.get('game'))
      .then((data: Game) => {
        dispatch({ type: 'EDIT_GAME', payload: { game: data } });
      })
      .catch((err) => console.error('Failed to load data: ', err))
      .finally(() => setLoading(false));

    // Set state of modals
    editGame({
      ...state,
      session: {
        modalState: {
          movePlayersModal: false,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save states to storage when they change
  useEffect(() => {
    if (!loading) {
      storage
        .set('game', state)
        .catch((err) => console.error('Failed to save game: ' + err));
    }
  }, [state, loading]);

  useEffect(() => {
    setPlayers(state.players);
  }, [state.players]);

  // Game functions

  const addPlayer = (name: string) => {
    dispatch({ type: 'ADD_PLAYER', payload: { name: name } });
  };

  const clearScores = () => {
    dispatch({ type: 'CLEAR_SCORES' });
  };

  const deletePlayer = (playerId: string) => {
    dispatch({ type: 'DELETE_PLAYER', payload: { playerId } });
  };

  const editGame = (game: Game) => {
    dispatch({ type: 'EDIT_GAME', payload: { game: game } });
  };

  const editHand = (hand: Hand) => {
    dispatch({ type: 'EDIT_HAND', payload: { hand: hand } });
  };

  const editOptions = (options: Options) => {
    dispatch({ type: 'EDIT_OPTIONS', payload: { options: options } });
  };

  const editPlayer = (player: Player) => {
    dispatch({ type: 'EDIT_PLAYER', payload: { player: player } });
  };

  const newGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  const setActiveRound = (round: string) => {
    dispatch({ type: 'SET_ACTIVE_ROUND', payload: { round: round } });
  };

  const setDealer = (selectedRound: string, selectedPlayerId: string) => {
    const totalRounds = state.options.fullRounds.length;
    const selectedRoundIndex = state.options.fullRounds.indexOf(selectedRound);
    const selectedPlayerIndex = state.players
      .map((item) => item.id)
      .indexOf(selectedPlayerId);

    // Get dealer for the given round
    function getDealer(roundIndex: number) {
      const offset =
        (selectedPlayerIndex - selectedRoundIndex) % state.players.length;
      const dealerIndex =
        (roundIndex + offset + state.players.length) % state.players.length;
      return state.players[dealerIndex].id;
    }

    // Output dealer and round details
    const dealerOrder = [];
    for (let i = 0; i < totalRounds; i++) {
      dealerOrder.push({
        round: state.options.fullRounds[i],
        playerId: getDealer(i),
      });
    }

    console.log(dealerOrder);

    dispatch({
      type: 'SET_DEALER_ORDER',
      payload: { dealerOrder: dealerOrder },
    });
  };

  const value: GameContextType = {
    state,
    players,
    addPlayer,
    clearScores,
    deletePlayer,
    editGame,
    editHand,
    editOptions,
    editPlayer,
    newGame,
    setActiveRound,
    setDealer,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

const useGameContext = (): GameContextType | undefined => {
  const context = useContext(GameContext);
  return context;
};

export { GameContext, GameProvider, useGameContext };
