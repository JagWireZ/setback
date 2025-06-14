import { memo } from 'react';

import PlayerColumn from './PlayerColumn';

import { GameContextType, useGameContext } from './contexts/GameContext';
import { Player } from '../utils/game';

interface PlayerColumns {
  round: string;
}

const PlayerColumns: React.FC<PlayerColumns> = ({ round }) => {
  const { state } = useGameContext() as GameContextType;

  return state.players.map((player: Player, index) => {
    return <PlayerColumn playerId={player.id} round={round} key={index} />;
  });
};

export default memo(PlayerColumns);
