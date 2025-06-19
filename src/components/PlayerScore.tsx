import { memo, useEffect, useState } from 'react';
import { IonItem, IonNote, IonLabel } from '@ionic/react';

import { useStore } from '../utils/state';
import { Hand } from '../utils/game';

interface PlayerScoreType {
  playerId: string;
}

const PlayerScore: React.FC<PlayerScoreType> = ({ playerId }) => {
  const { hands, options } = useStore((state) => state.game);
  
  const [playerHands, setPlayerHands] = useState<Hand[]>(
    hands.filter((item) => item.playerId === playerId)
  );

  const [total, setTotal] = useState<number>(0);
  const [possible, setPossible] = useState<number>(0);

  const getPlayerTotal = () => {
    let playerTotal = 0;
    playerHands.forEach((hand) => {
      if (options.rounds.includes(hand.round)) {
        playerTotal = playerTotal + hand.total;
      }
    });
    return playerTotal;
  };

  const getPlayerPossible = () => {
    let playerPossible = 0;
    playerHands.forEach((hand) => {
      if (options.rounds.includes(hand.round)) {
        playerPossible = playerPossible + hand.possible;
      }
    });
    return playerPossible;
  };

  useEffect(() => {
    setPlayerHands(hands.filter((item) => item.playerId === playerId));
  }, [playerId, hands]);

  useEffect(() => {
    setTotal(getPlayerTotal());
    setPossible(getPlayerPossible());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerHands]);

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
