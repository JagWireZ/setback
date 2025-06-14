import { IonButton, IonIcon, IonAlert } from '@ionic/react';
import { personAdd } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { memo, useState, useRef } from 'react';
import { GameContextType, useGameContext } from './contexts/GameContext';

addIcons({ personAdd });

const AddPlayerButton: React.FC = () => {
  const { addPlayer } = useGameContext() as GameContextType;
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [inputValue, setInputValue] = useState(''); // State to manage input value
  const alertRef = useRef<HTMLIonAlertElement>(null);

  const handleSubmit = (data: { playerName: string }) => {
    const name = data?.playerName || null;
    if (name) {
      console.log('Submitted name:', name);
      addPlayer(name);
    } else {
      console.log('No name entered');
    }
    setInputValue(''); // Clear input value
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    setInputValue(''); // Clear input value on cancel
    setIsAlertOpen(false);
  };

  return (
    <>
      <IonButton onClick={() => setIsAlertOpen(true)}>
        <IonIcon slot="icon-only" icon={personAdd} color="light" />
      </IonButton>
      <IonAlert
        ref={alertRef}
        isOpen={isAlertOpen}
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
            handler: handleCancel,
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
            console.log('Input found:', input); // Debug
            setTimeout(() => {
              input.focus(); // Focus the input
            }, 100);
            const handler = (event: KeyboardEvent) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                console.log('Enter key pressed, input value:', input.value); // Debug
                const okButton = alertRef.current?.querySelector(
                  'button[id="add-player-submit"]'
                ) as HTMLButtonElement;
                if (okButton) {
                  console.log('OK button found:', okButton); // Debug
                  okButton.click(); // Trigger OK button
                } else {
                  console.log('OK button not found'); // Debug
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
          } else {
            console.log('Input not found'); // Debug
          }
        }}
        onDidDismiss={() => {
          setInputValue(''); // Clear input value on dismiss
          setIsAlertOpen(false);
        }}
      />
    </>
  );
};

export default memo(AddPlayerButton);
