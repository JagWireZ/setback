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
  const [isTotalValid, setIsTotalValid] = useState<''|'invalid'>('');

  useEffect(() => {
    setHand(
      hands.filter(
        (item) => item.round === round && item.playerId === playerId
      )[0]
    );

    const roundHands = hands.filter(hand => hand.round === round);
    const bids = roundHands.map(hand => hand.bid);
    const actuals = roundHands.map(hand => hand.actual);
    if (!bids.includes(null) && !actuals.includes(null)) {
      const max = Number(round.match(/\d+/)![0]);
      const sum = actuals.reduce((total, num) => Number(total) + Number(num), 0);
      if ( sum !== max ) {
        setIsTotalValid('invalid');
      } else {
        setIsTotalValid('');
      }
    } else {
      setIsTotalValid('');
    }
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
        <IonCol className={isTotalValid}>
          <BookButton hand={hand} action="got" />
        </IonCol>
      </IonRow>
    </IonCol>
  );
};

export default memo(PlayerColumn);
