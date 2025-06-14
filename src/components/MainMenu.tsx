import { useRef, useState, memo } from 'react';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { refreshCircle, settings, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import NewGameModal from './NewGameModal';

addIcons({ refreshCircle });
addIcons({ settings });
addIcons({ trash });

const MainMenu: React.FC = () => {
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);

  const menuRef = useRef<HTMLIonMenuElement>(null);

  const closeMenu = () => {
    void menuRef.current?.setOpen(false);
  };

  return (
    <IonMenu
      ref={menuRef}
      contentId="content"
      menuId="main"
      side="start"
      swipeGesture={false}
    >
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle color="light">Options</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" color="light">
        <IonList>
          <IonItem color="light" button={true} id="open-new-game">
            <IonIcon
              color="tertiary"
              slot="start"
              icon="refresh-circle"
            ></IonIcon>
            <IonLabel color="tertiary">New Game</IonLabel>
            <NewGameModal
              closeMenu={closeMenu}
              isNewGameModalOpen={isNewGameModalOpen}
              setIsNewGameModalOpen={setIsNewGameModalOpen}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default memo(MainMenu);
