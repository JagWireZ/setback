import { IonCol, IonRow } from '@ionic/react';

import BookButton from './BookButton';
import { Hand } from '../utils/game';
import { GameContextType, useGameContext } from './contexts/GameContext';

import { useEffect, useState, memo } from 'react';

interface PlayerColumnType {
  playerId: string;
  round: string;
}

const PlayerColumn: React.FC<PlayerColumnType> = ({ playerId, round }) => {
  const { state } = useGameContext() as GameContextType;
  const [hand, setHand] = useState<Hand>(
    state.hands?.filter(
      (item) => item.round === round && item.playerId === playerId
    )[0]
  );

  useEffect(() => {
    setHand(
      state.hands.filter(
        (item) => item.round === round && item.playerId === playerId
      )[0]
    );
  }, [playerId, round, state.hands]);

  return (
    <IonCol
      className={
        playerId + ' player-column round-data ion-no-padding border-right-green'
      }
    >
      <IonRow>
        <IonCol>
          <BookButton hand={hand} action="bid" />
        </IonCol>
        <IonCol>
          <BookButton hand={hand} action="got" />
        </IonCol>
      </IonRow>
    </IonCol>
  );
};

export default memo(PlayerColumn);
