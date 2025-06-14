import { SetStateAction, useEffect, useRef, useState } from 'react';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonFooter,
  IonCheckbox,
} from '@ionic/react';
import {
  IonModalCustomEvent,
  OverlayEventDetail,
  IonSelectCustomEvent,
  SelectChangeEventDetail,
} from '@ionic/core';
import { Game } from '../utils/game';
import { createHands } from '../utils/game';
import { GameContextType, useGameContext } from './contexts/GameContext';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({ close });

interface NewGameModalType {
  closeMenu: () => void;
  isNewGameModalOpen: boolean;
  setIsNewGameModalOpen: (value: boolean) => void;
}

const NewGameModal: React.FC<NewGameModalType> = ({
  closeMenu,
  setIsNewGameModalOpen,
}) => {
  const { state, editGame } = useGameContext() as GameContextType;

  const [removePlayers, setRemovePlayers] = useState(false);
  const [cardCount, setCardCount] = useState(state.options.maxCards);
  const [tripRounds, setTripRounds] = useState(state.options.tripRounds);
  const [bookPoints, setBookPoints] = useState(state.options.scoring.book);
  const [extraPoints, setExtraPoints] = useState(state.options.scoring.extra);
  const [rainbowPoints, setRainbowPoints] = useState(
    state.options.scoring.rainbow
  );
  const [tripMultipler, setTripMultipler] = useState(
    state.options.scoring.tripMultiplier
  );
  const [roundCount, setRoundCount] = useState(
    state.options.fullRounds.filter(
      (round) => Number(round.match(/\d+/)![0]) <= cardCount
    )
  );

  useEffect(() => {
    setRoundCount(
      state.options.fullRounds.filter(
        (round) => Number(round.match(/\d+/)![0]) <= cardCount
      )
    );
  }, [cardCount, state.options.fullRounds]);

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  function confirm() {
    void modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function onDidDismiss() {
    setIsNewGameModalOpen(false);
    closeMenu();
  }

  const handleResetToDefault = () => {
    const defaultGame = new Game();
    setCardCount(defaultGame.options.maxCards);
    setTripRounds(defaultGame.options.tripRounds);
    setBookPoints(defaultGame.options.scoring.book);
    setExtraPoints(defaultGame.options.scoring.extra);
    setRainbowPoints(defaultGame.options.scoring.rainbow);
    setTripMultipler(defaultGame.options.scoring.tripMultiplier);
  };

  function onWillDismiss(
    event: IonModalCustomEvent<OverlayEventDetail<{ role: string }>>
  ) {
    if (event.detail.role === 'confirm') {
      const newGame = new Game();
      newGame.players = removePlayers === true ? [] : state.players;
      if (removePlayers === false) {
        newGame.players.map((player) => {
          const newHands = createHands(player.id);
          newGame.hands = [...newGame.hands, ...newHands];
        });
      }
      newGame.options = {
        ...newGame.options,
        maxCards: cardCount,
        rounds: state.options.fullRounds.filter((round) => {
          if (Number(round.match(/\d+/)![0]) <= cardCount) {
            return round;
          }
        }),
        tripRounds: tripRounds,
        scoring: {
          ...newGame.options.scoring,
          book: bookPoints,
          extra: extraPoints,
          rainbow: rainbowPoints,
          tripMultiplier: tripMultipler,
        },
      };
      editGame(newGame);
    }
    setRemovePlayers(false);
  }

  const cardCountList = [];
  for (let i = 10; i >= 1; i--) {
    cardCountList.push(i);
  }

  return (
    <IonModal
      className="popup-prompt"
      ref={modal}
      trigger="open-new-game"
      onDidDismiss={() => onDidDismiss()}
      onWillDismiss={(
        event: IonModalCustomEvent<OverlayEventDetail<{ role: string }>>
      ) => onWillDismiss(event)}
    >
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle>New Game</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonCheckbox
            checked={removePlayers}
            onIonChange={(event) => setRemovePlayers(event.detail.checked)}
          >
            Remove players?
          </IonCheckbox>
        </IonItem>
        <IonItemDivider />
        <IonAccordionGroup>
          <IonAccordion value="first">
            <IonItem slot="header" color="light">
              <IonLabel>Options</IonLabel>
            </IonItem>
            <div slot="content">
              <IonItem>
                <div className="align-right">
                  <IonButton
                    color="primary"
                    fill="outline"
                    strong={false}
                    onClick={() => handleResetToDefault()}
                  >
                    Reset to Defaults
                  </IonButton>
                </div>
              </IonItem>
              <IonItem>
                <IonSelect
                  label="Card Count"
                  value={cardCount}
                  onIonChange={(
                    event: IonSelectCustomEvent<
                      SelectChangeEventDetail<SetStateAction<number>>
                    >
                  ) => setCardCount(event.detail.value)}
                  className="popup-prompt"
                  interface="popover"
                  interfaceOptions={{
                    cssClass: 'popup-prompt',
                  }}
                >
                  {cardCountList.map((i) => {
                    return (
                      <IonSelectOption key={i} value={i}>
                        {i}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonSelect
                  label="Trip Rounds"
                  value={tripRounds}
                  multiple={true}
                  onIonChange={(
                    event: IonSelectCustomEvent<
                      SelectChangeEventDetail<SetStateAction<string[]>>
                    >
                  ) => setTripRounds(event.detail.value)}
                  className="popup-prompt"
                  interface="popover"
                  interfaceOptions={{
                    cssClass: 'popup-prompt',
                  }}
                >
                  {roundCount.map((i) => {
                    return (
                      <IonSelectOption key={i} value={i}>
                        {i}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonInput
                  label="Points per Book"
                  value={bookPoints}
                  onIonChange={(event) =>
                    setBookPoints(Number(event.detail.value))
                  }
                  labelPlacement="floating"
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  label="Points per Extra Book"
                  value={extraPoints}
                  onIonChange={(event) =>
                    setExtraPoints(Number(event.detail.value))
                  }
                  labelPlacement="floating"
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  label="Points for Rainbow"
                  value={rainbowPoints}
                  onIonChange={(event) =>
                    setRainbowPoints(Number(event.detail.value))
                  }
                  labelPlacement="floating"
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  label="Trip Multiplier"
                  value={tripMultipler}
                  onIonChange={(event) =>
                    setTripMultipler(Number(event.detail.value))
                  }
                  labelPlacement="floating"
                ></IonInput>
              </IonItem>
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
      <IonFooter>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonButton
              color="danger"
              fill="solid"
              strong={false}
              onClick={() => void modal.current?.dismiss()}
            >
              Cancel
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              color="success"
              fill="solid"
              strong={true}
              onClick={() => confirm()}
            >
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default NewGameModal;
