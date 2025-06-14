import { v4 as uuid } from 'uuid';

export class Options {
  scoring: {
    book: number;
    extra: number;
    rainbow: number;
    tripMultiplier: number;
  };
  tripRounds: string[];
  maxCards: number;
  rounds: string[];
  fullRounds: string[];

  constructor() {
    this.scoring = {
      book: 10,
      extra: 1,
      rainbow: 25,
      tripMultiplier: 3,
    };
    this.tripRounds = ['3d', '2d', '1', '2u', '3u'];
    this.maxCards = 10;
    this.fullRounds = [
      '10d',
      '9d',
      '8d',
      '7d',
      '6d',
      '5d',
      '4d',
      '3d',
      '2d',
      '1',
      '2u',
      '3u',
      '4u',
      '5u',
      '6u',
      '7u',
      '8u',
      '9u',
      '10u',
    ];
    this.rounds = this.fullRounds;
  }
}

export class Player {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuid().split('-')[0];
    this.name = name;
  }
}

export class Hand {
  id: string;
  round: string;
  playerId: string;
  bid: number | null;
  bidLabel: string;
  actual: number | null;
  actualLabel: string;
  max: number;
  rainbow: boolean;
  trip: boolean;
  total: number;
  possible: number;

  constructor(round: string, playerId: string) {
    this.id = uuid().split('-')[0];
    this.round = round;
    this.playerId = playerId;
    this.bid = null;
    this.bidLabel = '';
    this.actual = null;
    this.actualLabel = '';
    this.max = Number(round.match(/\d+/)![0]);
    this.rainbow = false;
    this.trip = false;
    this.total = 0;
    this.possible = 0;
  }
}

export class Game {
  options: Options;
  players: Player[];
  hands: Hand[];
  activeRound: string;
  dealerOrder: { round: string; playerId: string }[] | [];
  session: {
    modalState: {
      movePlayersModal: boolean;
    };
  };

  constructor() {
    this.players = [];
    this.hands = [];
    this.options = new Options();
    this.activeRound = this.options.fullRounds[0];
    this.dealerOrder = [];
    this.session = {
      modalState: {
        movePlayersModal: false,
      },
    };
  }
}

export const createHands = (playerId: string) => {
  const fullRounds = [
    '10d',
    '9d',
    '8d',
    '7d',
    '6d',
    '5d',
    '4d',
    '3d',
    '2d',
    '1',
    '2u',
    '3u',
    '4u',
    '5u',
    '6u',
    '7u',
    '8u',
    '9u',
    '10u',
  ];
  return fullRounds.map((round) => new Hand(round, playerId));
};

export const createPlayer = (name: string) => {
  const player = new Player(name);
  const hands: Hand[] = createHands(player.id);
  return { player, hands };
};
