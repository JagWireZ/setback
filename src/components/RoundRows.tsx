import { IonCol, IonRow } from '@ionic/react';

import PlayerColumns from './PlayerColumns';

import { memo, useEffect, useState, ReactElement } from 'react';
import { useStore } from '../utils/state';

const RoundRows: React.FC = () => {
  const { hands, options } = useStore((state) => state.game);
  const { activeRound, setActiveRound } = useStore((state) => state);

  const [activeRow, setActiveRow] = useState(activeRound);

  useEffect(() => {
    setActiveRow(activeRound);
  }, [activeRound]);

  useEffect(() => {
    setActiveRound(findActiveRound());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hands]);

  const findActiveRound = () => {
    const roundList = options.rounds;
    const tempHands = hands.filter((hand) =>
      roundList.includes(hand.round)
    );
    tempHands.sort(
      (a, b) => roundList.indexOf(a.round) - roundList.indexOf(b.round)
    );
    const nullHand = tempHands.find(
      (hand) => hand.bid === null || hand.actual === null
    );
    const result = nullHand === undefined ? activeRound : nullHand.round;
    return result;
  };

  let rows: ReactElement[] = [];
  options.rounds.map((round: string) => {
    const active = activeRow === round ? 'active' : '';
    const cardCount = Number(round.match(/\d+/)![0]);
    const numberClass = cardCount % 2 == 0 ? 'even' : 'odd';
    rows = rows.concat([
      <IonRow
        key={round}
        className={
          'round-row ' +
          round +
          ' ' +
          numberClass +
          ' ion-justify-content-start'
        }
      >
        <IonCol
          className={
            round + ' ' + active + ' first-column align-center ion-no-padding'
          }
        >
          <button
            className="round-button"
            id={round}
            color="light"
            onClick={() => setActiveRound(round)}
          >
            {Number(round.match(/\d+/)![0])}
          </button>
        </IonCol>
        <PlayerColumns round={round} />
        <IonCol className="filler"></IonCol>
      </IonRow>,
    ]);
  });

  return <>{rows}</>;
};

export default memo(RoundRows);
