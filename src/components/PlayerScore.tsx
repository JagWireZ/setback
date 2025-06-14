import { memo, useEffect, useState } from 'react';
import { IonItem, IonNote, IonLabel } from '@ionic/react';

import { GameContextType, useGameContext } from './contexts/GameContext';
import { Hand } from '../utils/game';

interface PlayerScoreType {
  playerId: string;
}

const PlayerScore: React.FC<PlayerScoreType> = ({ playerId }) => {
  const { state } = useGameContext() as GameContextType;
  const [hands, setHands] = useState<Hand[]>(
    state.hands?.filter((item) => item.playerId === playerId)
  );

  const [total, setTotal] = useState<number>(0);
  const [possible, setPossible] = useState<number>(0);

  const getPlayerTotal = () => {
    let playerTotal = 0;
    hands?.forEach((hand) => {
      if (state.options.rounds.includes(hand.round)) {
        playerTotal = playerTotal + hand.total;
      }
    });
    return playerTotal;
  };

  const getPlayerPossible = () => {
    let playerPossible = 0;
    hands?.forEach((hand) => {
      if (state.options.rounds.includes(hand.round)) {
        playerPossible = playerPossible + hand.possible;
      }
    });
    return playerPossible;
  };

  useEffect(() => {
    setHands(state.hands?.filter((item) => item.playerId === playerId));
  }, [playerId, state.hands]);

  useEffect(() => {
    setTotal(getPlayerTotal());
    setPossible(getPlayerPossible());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hands]);

  return (
    <IonItem className="player-score">
      <IonLabel className="total ion-no-margin">{total}</IonLabel>
      <IonNote className="possible" slot="end">
        {possible}
      </IonNote>
    </IonItem>
  );
};

export default memo(PlayerScore);
