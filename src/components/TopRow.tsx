import { IonCol, IonImg, IonList, IonRow } from '@ionic/react';

import AddPlayerButton from './AddPlayerButton';
import PlayerName from './PlayerName';
import PlayerScore from './PlayerScore';
import { useStore } from '../utils/state';
import { ReactElement, useState } from 'react';
import MovePlayersModal from './MovePlayersModal';

const TopRow: React.FC = () => {
  const { players } = useStore((state) => state.game)
  const [isMovePlayersOpen, setIsMovePlayersOpen] = useState(false);

  const columns: ReactElement[] = players.map((player) => {
    return (
      <IonCol
        className="player-header player-column border-right-green"
        key={player.id}
      >
        <IonList className="ion-no-padding">
          <PlayerScore playerId={player.id} />
          <PlayerName
            playerId={player.id}
            isMovePlayersOpen={isMovePlayersOpen}
            setIsMovePlayersOpen={setIsMovePlayersOpen}
          />
        </IonList>
      </IonCol>
    );
  });

  return (
    <>
      <IonRow className="top-row ion-justify-content-start">
        <IonCol className="first-column logo-top-row">
          <IonImg src="assets/sblogo.png" />
        </IonCol>
        {columns}
        <IonCol className="top-right-column align-left">
          <AddPlayerButton />
        </IonCol>
      </IonRow>
      <MovePlayersModal
        isMovePlayersOpen={isMovePlayersOpen}
        setIsMovePlayersOpen={setIsMovePlayersOpen}
      />
    </>
  );
};

export default TopRow;
