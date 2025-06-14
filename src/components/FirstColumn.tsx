import { IonCol, IonRow } from '@ionic/react';

import { GameContextType, useGameContext } from './contexts/GameContext';

import { memo, ReactElement } from 'react';

const FirstColumn: React.FC = () => {
  const { state } = useGameContext() as GameContextType;

  let rows: ReactElement[] = [];
  rows = rows.concat([
    <IonRow key="top-row" className="top-row">
      <IonCol></IonCol>
    </IonRow>,
  ]);

  state.options.rounds.map((round: string) => {
    const cardCount = Number(round.match(/\d+/)![0]);
    const numberClass = cardCount % 2 == 0 ? 'even' : 'odd';
    rows = rows.concat([
      <IonRow key={round} className={round + ' ' + numberClass + ' round-row'}>
        <IonCol className={round + ' round-data'}>
          <button className="round-button" id={round} color="light">
            {Number(round.match(/\d+/)![0])}
          </button>
        </IonCol>
      </IonRow>,
    ]);
  });

  return (
    <IonCol className="parent-column first-column logo-top-row border">
      {rows.map((item) => {
        return item;
      })}
    </IonCol>
  );
};

export default memo(FirstColumn);
