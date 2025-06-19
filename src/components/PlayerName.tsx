import { IonActionSheet, IonAlert, IonItem, IonTitle } from '@ionic/react';
import { addIcons } from 'ionicons';

import React, { useEffect, useRef, useState, memo } from 'react';

import DealerIcon from './DealerIcon';
import { Player } from '../utils/game';
import { useStore } from '../utils/state';
import { idCard, idCardOutline, personCircleOutline } from 'ionicons/icons';

addIcons({
  idCard,
  idCardOutline,
  personCircleOutline
});


interface PlayerName {
  playerId: string;
  isMovePlayersOpen: boolean;
  setIsMovePlayersOpen: (value: boolean) => void;
}

const PlayerName: React.FC<PlayerName> = ({
  playerId,
  setIsMovePlayersOpen,
}) => {
  const { players } = useStore((state) => state.game);
  const { activeRound, deletePlayer, editPlayer } = useStore((state) => state);
  const [version, setVersion] = useState(0);

  const [player, setPlayer] = useState<Player>(
    players.filter((item) => item.id === playerId)[0]
  );

  useEffect(() => {
    setPlayer(players.filter((item) => item.id === playerId)[0]);
  }, [players, playerId]);

  const alertRef = useRef<HTMLIonAlertElement>(null);

  const handleEditSubmit = (data: { playerName: string }) => {
    const name = data?.playerName || null;
    if (name) {
      const newPlayer: Player = player as Player;
      newPlayer.name = name;
      editPlayer(newPlayer);
    }
  };

  return (
    <>
      <IonItem className="player-name" lines="none">
        <IonTitle
          className="pointer align-center"
          id={'player-name-' + playerId}
          color="light"
        >
          {player?.name}
        </IonTitle>
        <DealerIcon round={activeRound} playerId={playerId} />
      </IonItem>
      <IonActionSheet
        trigger={'player-name-' + playerId}
        header={player.name}
        className='popup-prompt'
        buttons={[
          {
            text: 'Rename',
            id: 'player-rename-' + playerId,
            data: {
              action: 'rename',
            },
          },
          {
            text: 'Move',
            data: {
              action: 'move',
            },
            handler: () => {
              alertRef.current?.dismiss();
              setIsMovePlayersOpen(true);
            }
          },
          {
            text: 'Delete',
            id: 'player-delete-' + playerId,
            role: 'destructive',
            data: {
              action: 'delete',
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ]}
      ></IonActionSheet>
      <IonAlert
        ref={alertRef}
        trigger={'player-rename-' + playerId}
        header="Rename Player"
        cssClass="popup-prompt"
        key={version}
        inputs={[
          {
            name: 'playerName', // Key to access the input value
            type: 'text',
            value: player?.name,
            cssClass: 'alert-input',
          },
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'OK',
            role: 'submit',
            handler: handleEditSubmit,
          },
        ]}
        onDidDismiss={() => {
          setVersion(version => version + 1);
        }}
      />
      <IonAlert
        ref={alertRef}
        trigger={'player-delete-' + playerId}
        header={'Delete Player ' + player?.name}
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
            handler: () => {
              deletePlayer(player.id);
              alertRef.current?.dismiss();
            },
          },
        ]}
      />
    </>
  );
};

export default memo(PlayerName);
