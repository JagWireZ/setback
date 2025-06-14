import { IonIcon } from '@ionic/react';
import { idCard, idCardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { memo, useEffect, useState } from 'react';
import { GameContextType, useGameContext } from './contexts/GameContext';

addIcons({ idCard });
addIcons({ idCardOutline });

interface DealerIconType {
  round: string;
  playerId: string;
}

const DealerIcon: React.FC<DealerIconType> = ({ round, playerId }) => {
  const { state, setDealer } = useGameContext() as GameContextType;
  const [activeDealer, setActiveDealer] = useState(
    state.dealerOrder.find((item) => item.round === round)?.playerId
  );

  useEffect(() => {
    setActiveDealer(
      state.dealerOrder.find((item) => item.round === round)?.playerId
    );
  }, [state.dealerOrder, state.activeRound, round]);

  if (activeDealer === playerId) {
    return (
      <IonIcon
        icon="id-card"
        slot="end"
        color="light"
        className="dealer-icon active"
        onClick={() => setDealer(round, playerId)}
      />
    );
  } else {
    return (
      <IonIcon
        icon="id-card-outline"
        slot="end"
        color="light"
        className="dealer-icon"
        style={{ opacity: 0.2 }}
        onClick={() => setDealer(round, playerId)}
      />
    );
  }
};

export default memo(DealerIcon);
