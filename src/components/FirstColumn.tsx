import { IonCol, IonRow } from '@ionic/react';

import { memo, ReactElement } from 'react';
import { useStore } from '../utils/state';

const FirstColumn: React.FC = () => {
  const { options } = useStore((state) => state.game);

  let rows: ReactElement[] = [];
  rows = rows.concat([
    <IonRow key="top-row" className="top-row">
      <IonCol></IonCol>
    </IonRow>,
  ]);

  options.rounds.map((round: string) => {
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
