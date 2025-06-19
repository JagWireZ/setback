import { IonIcon } from '@ionic/react';
import { idCard, idCardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { memo, useEffect, useState } from 'react';
import { useStore } from '../utils/state';

addIcons({ idCard });
addIcons({ idCardOutline });

interface DealerIconType {
  round: string;
  playerId: string;
}

const DealerIcon: React.FC<DealerIconType> = ({ round, playerId }) => {
  const { activeRound, dealerOrder, setDealerOrder } = useStore((state) => state);
  const [activeDealer, setActiveDealer] = useState(
    dealerOrder.find((item) => item.round === round)?.playerId
  );

  useEffect(() => {
    setActiveDealer(
      dealerOrder.find((item) => item.round === round)?.playerId
    );
  }, [dealerOrder, activeRound, round]);

  if (activeDealer === playerId) {
    return (
      <IonIcon
        icon="id-card"
        slot="end"
        color="light"
        className="dealer-icon active"
        onClick={() => setDealerOrder(round, playerId)}
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
        onClick={() => setDealerOrder(round, playerId)}
      />
    );
  }
};

export default memo(DealerIcon);
