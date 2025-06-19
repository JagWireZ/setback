import { IonCol, IonRow } from '@ionic/react';

import BookButton from './BookButton';
import { Hand } from '../utils/game';

import { useEffect, useState, memo } from 'react';
import { useStore } from '../utils/state';

interface PlayerColumnType {
  playerId: string;
  round: string;
}

const PlayerColumn: React.FC<PlayerColumnType> = ({ playerId, round }) => {
  const { hands } = useStore((state) => state.game);
  const [hand, setHand] = useState<Hand>(
    hands.filter(
      (item) => item.round === round && item.playerId === playerId
    )[0]
  );

  useEffect(() => {
    setHand(
      hands.filter(
        (item) => item.round === round && item.playerId === playerId
      )[0]
    );
  }, [playerId, round, hands]);

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
