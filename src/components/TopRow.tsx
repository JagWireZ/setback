import { IonCol, IonImg, IonList, IonRow } from '@ionic/react';

import AddPlayerButton from './AddPlayerButton';
import PlayerName from './PlayerName';
import PlayerScore from './PlayerScore';
import { GameContextType, useGameContext } from './contexts/GameContext';
import { ReactElement } from 'react';

const TopRow: React.FC = () => {
  const { players } = useGameContext() as GameContextType;

  const columns: ReactElement[] = players.map((player) => {
    return (
      <IonCol
        className="player-header player-column border-right-green"
        key={player.id}
      >
        <IonList className="ion-no-padding">
          <PlayerScore playerId={player.id} />
          <PlayerName playerId={player.id} />
        </IonList>
      </IonCol>
    );
  });

  return (
    <IonRow className="top-row ion-justify-content-start">
      <IonCol className="first-column logo-top-row">
        <IonImg src="assets/images/sblogo.png" />
      </IonCol>
      {columns}
      <IonCol className="top-right-column align-left">
        <AddPlayerButton />
      </IonCol>
    </IonRow>
  );
};

export default TopRow;
