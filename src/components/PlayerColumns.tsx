import { memo } from 'react';

import PlayerColumn from './PlayerColumn';
import { Player } from '../utils/game';
import { useStore } from '../utils/state';

interface PlayerColumns {
  round: string;
}

const PlayerColumns: React.FC<PlayerColumns> = ({ round }) => {
  const { players } = useStore((state) => state.game);

  return players.map((player: Player, index) => {
    return <PlayerColumn playerId={player.id} round={round} key={index} />;
  });
};

export default memo(PlayerColumns);
