import {
  IonButtons,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonReorder,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import type { ItemReorderEventDetail } from '@ionic/react';
import { useCallback, useRef } from 'react';
import { useStore } from '../utils/state';

type MovePlayersModalType = {
  isMovePlayersOpen: boolean;
  setIsMovePlayersOpen: (value: boolean) => void
}

const MovePlayersModal: React.FC<MovePlayersModalType> = ({
  isMovePlayersOpen,
  setIsMovePlayersOpen
}) => {
  const { game, dealerOrder, editGame, setDealerOrder } = useStore((state) => state);
  const modalRef = useRef<HTMLIonModalElement>(null);

  const handleReorder = useCallback((event: CustomEvent<ItemReorderEventDetail>) => {
    event.detail.complete();
    const updatedPlayers = [...game.players];
    const [movedPlayer] = updatedPlayers.splice(event.detail.from, 1);
    updatedPlayers.splice(event.detail.to, 0, movedPlayer);
    editGame({ ...game, players: updatedPlayers });

    const startingDealer = dealerOrder.find(item => item.round === '10d');
    if ( startingDealer !== undefined ) {
      setDealerOrder(startingDealer.round, startingDealer.playerId);
    }
  }, [game, editGame, dealerOrder, setDealerOrder]);

  return (
    <IonModal
      className="popup-prompt"
      ref={modalRef}
      isOpen={isMovePlayersOpen}
      onDidDismiss={() => setIsMovePlayersOpen(false)}
    >
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle className="align-center">Move Players</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
            {game.players.map(player => (
              <IonItem key={player.id}>
                <IonLabel>{player.name}</IonLabel>
                <IonReorder slot="end" />
              </IonItem>
            ))}
          </IonReorderGroup>
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar color="light">
          <IonButtons slot="end">
            <IonButton
              color="success"
              fill="solid"
              strong
              onClick={() => modalRef.current?.dismiss()}
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
