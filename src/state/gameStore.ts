import create from 'zustand/vanilla';
import { STARTING_LIVES, STARTING_MONEY } from '../utils/Constants';

interface GameState {
  money: number;
  lives: number;
  level: number;
  wave: number;
  actions: {
    spendMoney: (amount: number) => void;
    earnMoney: (amount: number) => void;
    loseLife: () => void;
    setWave: (wave: number) => void;
    setLevel: (level: number) => void;
  };
}

export const useGameStore = create<GameState>((set) => ({
  money: STARTING_MONEY,
  lives: STARTING_LIVES,
  level: 1,
  wave: 0,
  actions: {
    spendMoney: (amount) => set((state) => ({ money: state.money - amount })),
    earnMoney: (amount) => set((state) => ({ money: state.money + amount })),
    loseLife: () => set((state) => ({ lives: state.lives - 1 })),
    setWave: (wave) => set({ wave }),
    setLevel: (level) => set({ level }),
  },
}));
