import { IonAlert, IonItem, IonTitle } from '@ionic/react';
import { addIcons } from 'ionicons';

import React, { useRef, useState, memo } from 'react';

import MovePlayersModal from './MovePlayersModal';
import DealerIcon from './DealerIcon';
import { Player } from '../utils/game';
import { GameContextType, useGameContext } from './contexts/GameContext';
import { idCard, idCardOutline } from 'ionicons/icons';

addIcons({ idCard });
addIcons({ idCardOutline });

interface PlayerName {
  playerId: string;
}

const PlayerName: React.FC<PlayerName> = ({ playerId }) => {
  const { state, deletePlayer, editPlayer } =
    useGameContext() as GameContextType;
  const [player, setPlayer] = useState<Player>(
    state.players.filter((item) => item.id === playerId)[0]
  );
  const [trigger, setTrigger] = useState(0); // Trigger to re-render if canceled
  const [isEditPlayerOpen, setIsEditPlayerOpen] = useState(false);
  const [isDeletePlayerOpen, setIsDeletePlayerOpen] = useState(false);
  const [isMovePlayersModalOpen, setIsMovePlayersModalOpen] = useState(false);

  const alertRef = useRef<HTMLIonAlertElement>(null);

  const handleEditSubmit = (data: { playerName: string }) => {
    console.log(data);
    const name = data?.playerName || null;
    if (name) {
      console.log('Submitted name:', name);
      editPlayer({ ...player, name: name });
      setPlayer({ ...player, name: name });
    } else {
      console.log('No name entered');
    }
    setIsEditPlayerOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditPlayerOpen(false);
    setTrigger((trigger) => trigger + 1);
  };

  const handleDeleteButton = () => {
    setIsEditPlayerOpen(false);
    setIsDeletePlayerOpen(true);
  };

  const handleDeletePlayer = () => {
    deletePlayer(player.id);
    setIsDeletePlayerOpen(false);
  };

  const handleMoveButton = () => {
    setIsMovePlayersModalOpen(true);
  };

  return (
    <>
      <IonItem className="player-name" lines="none">
        <IonTitle
          className="pointer align-center"
          color="light"
          onClick={() => setIsEditPlayerOpen(true)}
        >
          {player?.name}
        </IonTitle>
        <DealerIcon round={state.activeRound} playerId={playerId} />
      </IonItem>
      <MovePlayersModal
        isMovePlayersModalOpen={isMovePlayersModalOpen}
        setIsMovePlayersModalOpen={setIsMovePlayersModalOpen}
      />
      <IonAlert
        ref={alertRef}
        isOpen={isEditPlayerOpen}
        key={trigger}
        header="Edit Player"
        cssClass="popup-prompt"
        inputs={[
          {
            name: 'playerName', // Key to access the input value
            type: 'text',
            value: player.name,
            cssClass: 'alert-input',
          },
        ]}
        buttons={[
          {
            text: 'OK',
            role: 'submit',
            handler: handleEditSubmit,
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: handleEditCancel,
          },
          {
            text: 'Delete',
            role: 'delete',
            cssClass: 'warning-color',
            handler: handleDeleteButton,
          },
          {
            text: 'Move',
            role: 'move',
            handler: handleMoveButton,
          },
        ]}
        onDidDismiss={() => {
          setIsEditPlayerOpen(false);
        }}
      />

      <IonAlert
        ref={alertRef}
        isOpen={isDeletePlayerOpen}
        header={'Delete Player ' + player.name}
        cssClass="popup-prompt"
        message="Are you sure you want to delete this player?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'DELETE',
            role: 'delete',
            handler: handleDeletePlayer,
          },
        ]}
        onDidDismiss={() => {
          setIsDeletePlayerOpen(false);
        }}
      />
    </>
  );
};

export default memo(PlayerName);
