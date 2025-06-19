import { IonButton, IonIcon, IonAlert } from '@ionic/react';
import { personAdd } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { memo, useState, useRef } from 'react';

import { useStore } from '../utils/state';

addIcons({ personAdd });

const AddPlayerButton: React.FC = () => {
  const { addPlayer } = useStore((state) => state);

  const [inputValue, setInputValue] = useState(''); // State to manage input value
  const alertRef = useRef<HTMLIonAlertElement>(null);

  const handleSubmit = (data: { playerName: string }) => {
    const name = data?.playerName || null;
    if (name) {
      addPlayer(name);
    }
  };

  return (
    <>
      <IonButton id='add-player-button'>
        <IonIcon slot="icon-only" icon={personAdd} color="light" />
      </IonButton>
      <IonAlert
        ref={alertRef}
        trigger='add-player-button'
        header="Enter Name"
        cssClass="popup-prompt"
        inputs={[
          {
            name: 'playerName',
            type: 'text',
            placeholder: 'Player name',
            value: inputValue, // Bind state to input
            attributes: {
              id: 'playerNameInput',
            },
          },
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'OK',
            id: 'add-player-submit',
            role: 'submit',
            handler: handleSubmit,
          },
        ]}
        onIonAlertDidPresent={() => {
          // Blur any currently focused element
          if (document.activeElement) {
            (document.activeElement as HTMLElement).blur();
          }
          // Focus the input and attach Enter key listener
          const input = document.querySelector(
            '#playerNameInput'
          ) as HTMLInputElement;
          if (input) {
            setTimeout(() => {
              input.focus(); // Focus the input
            }, 100);
            const handler = (event: KeyboardEvent) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                const okButton = alertRef.current?.querySelector(
                  'button[id="add-player-submit"]'
                ) as HTMLButtonElement;
                if (okButton) {
                  okButton.click(); // Trigger OK button
                }
              }
            };
            input.addEventListener('keypress', handler);
            // Clean up listener on dismiss
            alertRef.current?.addEventListener('ionAlertDidDismiss', () => {
              input.removeEventListener('keypress', handler);
            });
            // Update state on input change
            input.addEventListener('input', () => {
              setInputValue(input.value);
            });
          }
        }}
        onDidDismiss={() => {
          setInputValue('');
        }}
      />
    </>
  );
};

export default memo(AddPlayerButton);
