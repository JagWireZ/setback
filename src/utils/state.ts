import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Game, Hand, Options, Player } from './game';

type GameStore = {
  game: Game;
  activeRound: string;
  dealerOrder: { round: string, playerId: string }[];
  addPlayer: ( name: string ) => void;
  deletePlayer: ( playerId: string ) => void;
  editGame: ( game: Game ) => void;
  editHand: ( hand: Hand ) => void;
  editOptions: ( options: Options ) => void;
  editPlayer: ( player: Player ) => void;
  newGame: () => void;
  setActiveRound: ( round: string ) => void;
  setDealerOrder: ( round: string, playerId: string ) => void;
}

export const useStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: new Game(),
      activeRound: '10d',
      dealerOrder: [],
      addPlayer: ( name: string ) => {
        const game = get().game;
        const player = new Player(name);
        const hands = game.options.fullRounds.map( round => new Hand(round, player.id));
        set({ game: { 
          ...game,
          players: [...game.players, player],
          hands: [...game.hands, ...hands]
        }})
      },
      deletePlayer: ( playerId: string ) => {
        const game = get().game;
        set({ game: {
          ...game,
          players: game.players.filter( player => player.id !== playerId),
          hands: game.hands.filter( hand => hand.playerId !== playerId),
        }})
      },
      editGame: ( game: Game ) => set({ game: game }),
      editHand: ( data: Hand ) => {
        const game = get().game;
        const hands = game.hands.map( (hand) => {
          if ( hand.round === data.round && hand.playerId === data.playerId) {
            return data;
          } else {
            return hand;
          }
        })
        set({ game: { ...game, hands: hands } });
      },
      editOptions: ( options: Options ) => {
        const game = get().game;
        set({ game: { ...game, options: options }});
      },
      editPlayer: ( player: Player ) => {
        const game = get().game;
        const players = game.players.map( p => {
          if ( p.id === player.id ) {
            return player;
          } else {
            return p
          }
        });
        set({ game: { ...game, players: players }});
      },
      newGame: () => set({ game: new Game() }),
      setActiveRound: ( round: string ) => set({ activeRound: round }),
      setDealerOrder: ( round: string, playerId: string ) => {
        const game = get().game;
        const totalRounds = game.options.fullRounds.length;
        const selectedRoundIndex = game.options.fullRounds.indexOf(round);
        const selectedPlayerIndex = game.players
          .map((item) => item.id)
          .indexOf(playerId);
    
        // Get dealer for the given round
        function getDealer(roundIndex: number) {
          const offset =
            (selectedPlayerIndex - selectedRoundIndex) % game.players.length;
          const dealerIndex =
            (roundIndex + offset + game.players.length) % game.players.length;
          return game.players[dealerIndex].id;
        }
    
        // Output dealer and round details
        const dealerOrder = [];
        for (let i = 0; i < totalRounds; i++) {
          dealerOrder.push({
            round: game.options.fullRounds[i],
            playerId: getDealer(i),
          });
        }
        set({ dealerOrder: dealerOrder })
      }
    }),
    {
      name: 'game',
    },
  ),
)
