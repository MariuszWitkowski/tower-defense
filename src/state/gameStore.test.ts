import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "./gameStore";
import { STARTING_LIVES, STARTING_MONEY } from "../utils/Constants";

const initialState = useGameStore.getState();

describe("gameStore", () => {
  beforeEach(() => {
    useGameStore.setState(initialState, true);
  });

  it("should have the correct initial state", () => {
    const { money, lives, level, wave, gameOver } = useGameStore.getState();
    expect(money).toBe(STARTING_MONEY);
    expect(lives).toBe(STARTING_LIVES);
    expect(level).toBe(1);
    expect(wave).toBe(0);
    expect(gameOver).toBe(false);
  });

  it("should spend money correctly", () => {
    const { actions } = useGameStore.getState();
    actions.spendMoney(10);
    expect(useGameStore.getState().money).toBe(STARTING_MONEY - 10);
  });

  it("should earn money correctly", () => {
    const { actions } = useGameStore.getState();
    actions.earnMoney(10);
    expect(useGameStore.getState().money).toBe(STARTING_MONEY + 10);
  });

  it("should lose a life correctly", () => {
    const { actions } = useGameStore.getState();
    actions.loseLife();
    expect(useGameStore.getState().lives).toBe(STARTING_LIVES - 1);
  });

  it("should set the wave correctly", () => {
    const { actions } = useGameStore.getState();
    actions.setWave(5);
    expect(useGameStore.getState().wave).toBe(5);
  });

  it("should set the level correctly", () => {
    const { actions } = useGameStore.getState();
    actions.setLevel(2);
    expect(useGameStore.getState().level).toBe(2);
  });

  it("should set gameOver correctly", () => {
    const { actions } = useGameStore.getState();
    actions.setGameOver(true);
    expect(useGameStore.getState().gameOver).toBe(true);
  });
});
