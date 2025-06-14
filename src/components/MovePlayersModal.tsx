import { useRef, useState } from 'react';
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonReorder,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
  ItemReorderEventDetail,
  IonFooter,
} from '@ionic/react';
import { GameContextType, useGameContext } from './contexts/GameContext';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Player } from '../utils/game';

addIcons({ close });

interface MovePlayersModalType {
  isMovePlayersModalOpen: boolean;
  setIsMovePlayersModalOpen: (value: boolean) => void;
}

const MovePlayersModal: React.FC<MovePlayersModalType> = ({
  isMovePlayersModalOpen,
  setIsMovePlayersModalOpen,
}) => {
  const { state, editGame } = useGameContext() as GameContextType;
  const [newPlayers, setNewPlayers] = useState<Player[]>(state.players);
  const [version, setVersion] = useState(0);

  const modal = useRef<HTMLIonModalElement>(null);

  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    const players = newPlayers;

    const [player] = players.splice(event.detail.from, 1);
    players.splice(event.detail.to, 0, player);
    event.detail.complete();
    setNewPlayers(players);
  };

  function onDidDismiss() {
    setIsMovePlayersModalOpen(false);
    editGame({ ...state, players: newPlayers });
    setVersion((version) => version + 1);
  }

  const elements = state.players.map((player) => {
    return (
      <IonItem key={player.id}>
        <IonLabel>{player.name}</IonLabel>
        <IonReorder slot="end"></IonReorder>
      </IonItem>
    );
  });

  return (
    <IonModal
      className="popup-prompt"
      ref={modal}
      isOpen={isMovePlayersModalOpen}
      onDidDismiss={onDidDismiss}
      key={version}
    >
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle className="align-center">Move Players</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
            {elements}
          </IonReorderGroup>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar color="light">
          <IonButtons slot="end">
            <IonButton
              color="success"
              fill="solid"
              strong={true}
              onClick={() => void modal.current?.dismiss()}
            >
              Done
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default MovePlayersModal;
