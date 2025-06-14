import { memo } from 'react';
import {
  IonCol,
  IonGrid,
  IonHeader,
  IonMenuButton,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/react';

import { GameContextType, useGameContext } from './contexts/GameContext';

const Header: React.FC = () => {
  const { state } = useGameContext() as GameContextType;

  return (
    <IonHeader>
      <IonToolbar className="main-toolbar" color="tertiary">
        <IonGrid>
          <IonRow>
            <IonCol size="1" className="align-left">
              <IonMenuButton color="light"></IonMenuButton>
            </IonCol>
            <IonCol className="align-center">
              <IonText className="round-value" color="light">
                {state.activeRound}
              </IonText>
            </IonCol>
            <IonCol size="1" />
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonHeader>
  );
};

export default memo(Header);
