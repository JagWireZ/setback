import { IonCol, IonRow } from '@ionic/react';

import PlayerColumns from './PlayerColumns';
import { GameContextType, useGameContext } from './contexts/GameContext';

import { memo, useEffect, useState, ReactElement } from 'react';

const RoundRows: React.FC = () => {
  const { state, setActiveRound } = useGameContext() as GameContextType;
  const [activeRow, setActiveRow] = useState(state.activeRound);

  useEffect(() => {
    setActiveRow(state.activeRound);
  }, [state.activeRound]);

  useEffect(() => {
    setActiveRound(findActiveRound());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hands]);

  const findActiveRound = () => {
    const roundList = state.options.rounds;
    const tempHands = state.hands.filter((hand) =>
      roundList.includes(hand.round)
    );
    tempHands.sort(
      (a, b) => roundList.indexOf(a.round) - roundList.indexOf(b.round)
    );
    const nullHand = tempHands.find(
      (hand) => hand.bid === null || hand.actual === null
    );
    const result = nullHand === undefined ? state.activeRound : nullHand.round;
    return result;
  };

  let rows: ReactElement[] = [];
  state.options.rounds.map((round: string) => {
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
