import { IonSelect, IonSelectOption } from '@ionic/react';

import { Hand } from '../utils/game';

import { memo, useEffect, useState } from 'react';
import { useStore } from '../utils/state';

interface BookButton {
  hand: Hand;
  action: 'bid' | 'got';
}

const BookButton: React.FC<BookButton> = ({ hand, action }) => {
  const { options } = useStore((state) => state.game);
  const { editHand } = useStore((state) => state);
  const [isRainbow, setIsRainbow] = useState<boolean>(hand?.rainbow);
  const [cssRainbow, setCssRainbow] = useState<string>('');

  useEffect(() => {
    const value = isRainbow === true ? 'rainbow' : '';
    setCssRainbow(value);
  }, [isRainbow]);

  useEffect(() => {
    setIsRainbow(hand.rainbow);
  }, [hand])

  let selectOptions: React.ReactElement[] = [];
  selectOptions = selectOptions.concat([
    <IonSelectOption key="blank" value={null} color="light"></IonSelectOption>,
  ]);

  for (let i = 0; i <= hand.max; i++) {
    selectOptions = selectOptions.concat([
      <IonSelectOption key={i} value={i} color="light">
        {i}
      </IonSelectOption>,
    ]);
    if (
      action === 'bid' &&
      i === hand.max &&
      options.tripRounds.includes(hand.round)
    ) {
      selectOptions = selectOptions.concat([
        <IonSelectOption key={i + 'T'} value="T" color="light">
          Trip
        </IonSelectOption>,
      ]);
    }
    if (
      action === 'bid' &&
      i === hand.max &&
      ['4d', '4u'].includes(hand.round)
    ) {
      selectOptions = selectOptions.concat([
        <IonSelectOption key={i + 'R'} value="R" color="light">
          Rainbow
        </IonSelectOption>,
      ]);
    }
  }

  const setBid = (value: number | 'T' | 'R' | null) => {
    const data = hand;
    switch (value) {
      case 'R':
        data.rainbow = !isRainbow;
        setIsRainbow(data.rainbow);
        break;
      case 'T':
        data.bid = data.max;
        data.bidLabel = 'Trip';
        data.trip = true;
        break;
      case null:
        data.bid = null;
        data.bidLabel = '';
        data.trip = false;
        break;
      default:
        data.bid = value;
        data.bidLabel = value.toString();
        data.trip = false;
    }
    updateScores(data);
  };

  const setActual = (value: number | null) => {
    const data = hand;
    data.actual = value;
    data.actualLabel = data.actual === null ? '' : data.actual.toString();
    updateScores(data);
  };

  const updateScores = (data: Hand) => {
    if (data.actual === null || data.bid === null) {
      data.total = 0;
      data.possible = 0;
    } else {
      data.total = getTotal(data);
      data.possible = getPossible(data);
    }
    editHand(data);
  };

  const getTotal = (data: Hand) => {
    let total = 0;
    // If the player tripped
    if (options.tripRounds.includes(data.round) && data.trip == true) {
      const wage =
        data.max *
        options.scoring.book *
        options.scoring.tripMultiplier;
      if (data.actual == data.max) {
        total = wage;
      } else {
        total = 0 - wage;
      }
    } else if (data.actual == data.bid) {
      total = data.bid! * options.scoring.book;
    } else if (data.actual! > data.bid!) {
      total =
        data.bid! * options.scoring.book +
        (data.actual! - data.bid!) * options.scoring.extra;
    } else if (data.actual! < data.bid!) {
      total = 0 - data.bid! * options.scoring.book;
    }
    if (['4d', '4u'].includes(data.round) && data.rainbow == true) {
      total = total + options.scoring.rainbow;
    }
    return total;
  };

  const getPossible = (data: Hand) => {
    let possible = data.actual! * options.scoring.book;
    if (
      options.tripRounds.includes(data.round) &&
      data.actual == data.max
    ) {
      possible = possible * options.scoring.tripMultiplier;
    }
    if (['4d', '4u'].includes(data.round) && data.rainbow == true) {
      possible = possible + options.scoring.rainbow;
    }
    return possible;
  };

  const handleBidChange = (
    event: CustomEvent<{ value: number | 'T' | 'R' | null }>
  ) => {
    setBid(event.detail.value);
  };

  const handleGotChange = (event: CustomEvent<{ value: number | null }>) => {
    setActual(event.detail.value);
  };

  const initValue = () => {
    if (action === 'got') {
      return hand?.actual;
    } else if (hand?.trip === true) {
      return 'T';
    } else {
      return hand?.bid;
    }
  };

  return (
    <IonSelect
      className={'book-button ' + action + ' ' + cssRainbow}
      interface="popover"
      interfaceOptions={{
        cssClass: 'popup-prompt ' + action,
      }}
      placeholder={action.toUpperCase()}
      onIonChange={action === 'bid' ? handleBidChange : handleGotChange}
      value={initValue()}
      selectedText={action === 'bid' ? hand.bidLabel : hand.actualLabel}
    >
      {selectOptions.map((item) => {
        return item;
      })}
    </IonSelect>
  );
};

export default memo(BookButton);
